import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatosPerfilComponent } from '../datos-perfil/datos-perfil.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { FiltroComponent } from '../filtro/filtro.component';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent {


  cargando:boolean = false;
  turnos: any;
  usuario:any;


  lista : MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  tableDetalle : string[] = ['fecha','horario','paciente','especialista','especialidad','estado','acciones'];

  constructor(private firestore:FirestoreService,private formBuilder :FormBuilder,
    public dialog: MatDialog,private auth: AuthService){
    
  }

  
  form = this.formBuilder.group({
    especialidad: ['' as unknown as any,[]],
    especialista: ['' as unknown as any,[]],
    paciente: ['' as unknown as any,[]],
  });

  async ngOnInit(){
    this.cargando = true;
    this.usuario = await this.auth.getUsuarioLogueado();
    let usuarios = await this.firestore.obtener("usuarios");
    /*this.especialidades = await this.firestore.obtener("especialidades");
    this.pacientes = usuarios.filter((element : any)=> element.data.perfil === "Paciente")
    this.especialistas = usuarios.filter((element : any)=> element.data.perfil === "Especialista")*/
    await this.cargarTurnos();
    this.cargando = false;
  }

  private async cargarTurnos(paciente?:any ){
    this.turnos = await this.firestore.obtener("turnos");
    let aux : any [] = [];
    this.turnos.forEach((turno:any) => {
      turno.data.dia.forEach((dia:any) => {
        dia.hora.forEach((hora:any) => {
          if((this.usuario.data.perfil === "Paciente" && hora.paciente.id === this.usuario.id) ||
              (this.usuario.data.perfil === "Especialista" && turno.data.especialista.id === this.usuario.id) || 
              (this.usuario.data.perfil === "Administrador")){
            let turnoFormateado = this.crearFormatoTurno(turno,dia,hora);
            aux.push(turnoFormateado);
          }
        });
      });
    });
    this.lista.data = aux;
  }

  private crearFormatoTurno(turno:any,dia:any,hora:any){
    let turnoFormateado : any = {};
    turnoFormateado.especialistaId = turno.data.especialista.id
    turnoFormateado.especialista = turno.data.especialista.data.datos.apellido
    turnoFormateado.especialistaObj = turno.data.especialista.data
    turnoFormateado.fecha = new Date(dia.fecha)
    turnoFormateado.especialidad = dia.especialidad.data.nombre
    turnoFormateado.especialidadObj = dia.especialidad.data
    turnoFormateado.especialidadObj.id = dia.especialidad.id
    turnoFormateado.horario = hora.horario
    turnoFormateado.estado = hora.estado
    turnoFormateado.paciente = hora.paciente.data.datos.apellido
    turnoFormateado.pacienteObj = hora.paciente.data
    turnoFormateado.pacienteObj.id = hora.paciente.id
    turnoFormateado.turnoObj = turno;
    turnoFormateado.comentario = hora.comentario;
    turnoFormateado.diagnostico = hora.diagnostico;
    return turnoFormateado;
  }

  public selectEspecialidad = function (option: any, value: any): boolean {

    if (value == null) {
      return false;
    }
    return option.id === value.id;
  }


  public selectEspecialista = function (option: any, value: any): boolean {

    if (value == null) {
      return false;
    }
    
    return option.id === value.id;
  }

  public selectPaciente = function (option: any, value: any): boolean {

    if (value == null) {
      return false;
    }
    return option.id === value.id;
  }


  async filtrar(){
    if(!this.cargando){
      await this.limpiarFiltros();
      const dialogRef = this.dialog.open(FiltroComponent, {
        data: {usuario : this.usuario,turnos: this.lista.data},
        width: 'auto',
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe((result:any) => {
       //console.log(result)
        this.lista.data = result
      });
    }
  }

  sonFechasIguales(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    );
  }

  async agregarEstado(turno:any,fecha:any,horaParam:any,comentario:any="",estado:any,diagnostico:any=""){
    const promises: Promise<any>[] = [];
    let retorno = false;

     turno.data.dia.forEach( (dia:any) => {
       dia.hora.forEach((hora:any) => {
        if(hora.horario === horaParam && this.sonFechasIguales(new Date(dia.fecha),fecha)){
          hora.comentario = comentario;
          hora.estado = estado;
          hora.diagnostico = diagnostico;
          retorno = true;
          promises.push(this.firestore.modificar(turno, "turnos"));
        }
      });
    });

    await Promise.all(promises);
    return retorno;
  }

  async rechazarTurno(turno:any){
    
    const result = await Swal.fire({
      title: 'Rechazar turno',
      text: 'Ingrese un comentario del porque se rechaza:',
      input: 'text',
      heightAuto: false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Atras',
      showLoaderOnConfirm: true,
      preConfirm: (async (comentario) => {
        //console.log(comentario)
        if(await this.agregarEstado(turno.turnoObj,turno.fecha,turno.horario,comentario,"Rechazado")){
          Swal.fire("OK","Turno rechazado de manera correcta","success");
          await this.cargarTurnos();
        }
      }),
      allowOutsideClick: () => !Swal.isLoading()
    });

  }

  async aceptarTurno(turno:any){

    Swal.fire({
      title: "Esta seguro que quiere aceptar el turno ?",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Atras`,
      showLoaderOnConfirm: true,
      preConfirm: (async (comentario) => {
        //console.log(comentario)
        if(await this.agregarEstado(turno.turnoObj,turno.fecha,turno.horario,"","Aceptado")){
          Swal.fire("OK","Turno aceptado de manera correcta","success");
          await this.cargarTurnos();
        }
      }),
      allowOutsideClick: () => !Swal.isLoading()
    })
  }

  async finalizarTurno(turno: any) {
    const { value: comentario } = await Swal.fire({
      title: "Finalizar Turno",
      html:
        '<input type="text" id="comentario" class="swal2-input" placeholder="Comentario">' +
        '<input type="text" id="diagnostico" class="swal2-input" placeholder="Diagnóstico">',
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: "Atras",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const comentarioInput = document.getElementById("comentario") as HTMLInputElement;
        const diagnosticoInput = document.getElementById("diagnostico") as HTMLInputElement;
  
        const comentarioValue = comentarioInput.value;
        const diagnosticoValue = diagnosticoInput.value;

        console.log(comentarioValue)
        console.log(diagnosticoValue)
  
       if (await this.agregarEstado(turno.turnoObj, turno.fecha, turno.horario, comentarioValue,"Realizado", diagnosticoValue)) {
          Swal.fire("OK", "Turno finalizado de manera correcta", "success");
          await this.cargarTurnos();
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

  }

  async cancelarTurno(turno:any){
    
    const result = await Swal.fire({
      title: 'Cancelar turno',
      text: 'Ingrese un comentario del porque se cancela:',
      input: 'text',
      heightAuto: false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Atras',
      showLoaderOnConfirm: true,
      preConfirm: (async (comentario) => {
        //console.log(comentario)
        if(await this.agregarEstado(turno.turnoObj,turno.fecha,turno.horario,comentario,"Cancelado")){
          Swal.fire("OK","Turno cancelado de manera correcta","success");
          await this.cargarTurnos();
        }
      }),
      allowOutsideClick: () => !Swal.isLoading()
    });

  }

  verComentario(turno:any){
    if (turno.diagnostico) {
      Swal.fire({
        title: 'Información del turno',
        html: `Comentario: ${turno.comentario}<br>Diagnóstico: ${turno.diagnostico}`,
        icon: 'info',
      });
    } else {
      if(turno.estado === "Cancelado"){
        Swal.fire({
          title: 'Comentario de por qué se canceló el turno:',
          text: turno.comentario,
          icon: 'info',
        });
      }else{
        Swal.fire({
          title: 'Comentario de por qué se rechazo el turno:',
          text: turno.comentario,
          icon: 'info',
        });
      }
    }
  }

  verEspecialista(turno:any){

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos : turno.especialistaObj},
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  verPaciente(turno:any){

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos : turno.pacienteObj},
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  async limpiarFiltros(){
    this.cargando = true;
    this.form.reset();
    await this.cargarTurnos();
    this.cargando = false;
  }


}
