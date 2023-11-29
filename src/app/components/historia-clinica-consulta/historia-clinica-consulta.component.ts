import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatosPerfilComponent } from '../datos-perfil/datos-perfil.component';
import { MatDialog } from '@angular/material/dialog';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { PdfServiceService } from 'src/app/services/pdf-service.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-historia-clinica-consulta',
  templateUrl: './historia-clinica-consulta.component.html',
  styleUrls: ['./historia-clinica-consulta.component.css']
})
export class HistoriaClinicaConsultaComponent {

  cargando:boolean = false;
  historiasClinicas : any;
  usuario : any;
  lista : MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  form: FormGroup;
  tableDetalle : string[] = ['fecha','paciente','especialista','especialidad','acciones'];
  tablaExcel : string[] = ['fecha','paciente','especialista','especialidad'];
  pacientes:any = [];
  turnos:any = [];
  pacienteSeleccionado : any = null;
  especialistasFiltrados : any = []; 

  @ViewChild('tablaUno') tablaUno!: ElementRef;

  constructor(private firestore:FirestoreService,private auth: AuthService,public dialog: MatDialog,private pdfService:PdfServiceService,private formBuilder: FormBuilder){
    this.lista.paginator = this.paginator;

    this.form = this.formBuilder.group({
      especialista: [null, [Validators.required]],
    });
  }


  async ngOnInit(){
    this.cargando = true;
    this.historiasClinicas = await this.firestore.obtener("historiaClinica");
    this.turnos = await this.firestore.obtener("turnos");
    this.usuario = await this.auth.getUsuarioLogueado();

    if(this.usuario.data.perfil==="Paciente"){
      this.tableDetalle = ['fecha','especialista','especialidad','acciones'];
      let historiasPaciente = this.historiasClinicas.filter((historia:any)=> (historia.data.paciente.id === this.usuario.id))
      let aux :any[] = [];
      historiasPaciente.forEach((historia:any) => {
        if(!aux.includes(historia.data.especialista.id)){
          this.especialistasFiltrados.push(historia.data.especialista)
          aux.push(historia.data.especialista.id)
        }
      });

    }else if (this.usuario.data.perfil==="Especialista" || this.usuario.data.perfil==="Administrador"){
      
      let historiasPacientes;

      if(this.usuario.data.perfil==="Especialista"){
        this.tableDetalle = ['fecha','paciente','especialidad','acciones'];
        historiasPacientes = this.historiasClinicas.filter((historia:any)=> historia.data.especialista.id === this.usuario.id)
      }else{
        this.tableDetalle = ['fecha','paciente','especialidad','especialista','acciones'];
        historiasPacientes = this.historiasClinicas;
      }
        

      let aux :any[] = [];
      historiasPacientes.forEach((element:any) => {
        if(!aux.includes(element.data.paciente.datos.apellido)){
          this.pacientes.push(element.data.paciente)
          aux.push(element.data.paciente.datos.apellido)
        }
        
      });
      console.log(this.pacientes)
      this.lista.data = [];
    }
    this.cargando = false;
  }

  
  public selectEspecialista = function (option: any, value: any): boolean {

    if (value == null) {
      return false;
    }
    
    return option.id === value.id;
  }

  actualizarTabla(){
    if(this.form.valid){
      //console.log(this.form.value)
      this.lista.data = this.historiasClinicas.filter((historia:any)=> (historia.data.paciente.id === this.usuario.id && historia.data.especialista.id === this.form.value.especialista.id ))
    }
  }

  exportarExcel(){
    
    if(this.pacienteSeleccionado !== null){
      let nombreArchivo = this.pacienteSeleccionado.datos.apellido.toString() + this.pacienteSeleccionado.id.toString()

      // Crear un libro de Excel
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      // Hoja de Pacientes
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.tablaUno.nativeElement);
      XLSX.utils.book_append_sheet(wb, ws, 'Turnos');

      // Guardar en el archivo
      XLSX.writeFile(wb, nombreArchivo+'.xlsx');
    }
  }

  verEspecialista(elemento:any){

    let dato;
    if(this.usuario?.data?.perfil === 'Especialista' || this.usuario?.data?.perfil === 'Administrador'){
      dato = elemento.especialistaObj;
    }else{
      dato = elemento.data.turno.especialistaObj;
    }

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos : dato},//
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  async guardarHistoriaClinica(){
    if(this.form.valid){
      let historias = this.lista.data
      let paciente = historias[0].data.paciente
      //console.log(historias)
      //console.log(paciente)
      await this.pdfService.generatePdf(paciente,historias);
    }else{
      Swal.fire("ERROR","Debe seleccionar un especialista","error");
    }

  }


  verPaciente(elemento:any){

    let dato;
    if(this.usuario?.data?.perfil === 'Especialista' || this.usuario?.data?.perfil === 'Administrador'){
      dato = elemento.pacienteObj;
    }else{
      dato = elemento.data.turno.pacienteObj;
    }

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos :  dato},//historia.data.
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  verHistoria(elemento:any){
    let dato;
    if(this.usuario?.data?.perfil === 'Especialista' || this.usuario?.data?.perfil === 'Administrador'){
      dato = elemento;
    }else{
      elemento.data.turno.fecha = elemento.data.turno.fecha.toDate()
      dato = elemento.data.turno;
    }

    const dialogRef = this.dialog.open(HistoriaClinicaComponent, {
      data: {consulta:true,turno:dato},
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }


  async verTurnos(paciente?:any ){
    this.pacienteSeleccionado = paciente
    let aux : any [] = [];
    this.turnos.forEach((turno:any) => {
      turno.data.dia.forEach((dia:any) => {
        dia.hora.forEach((hora:any) => {
          if((this.usuario.data.perfil==="Especialista" &&  turno.data.especialista.id === this.usuario.id && hora.paciente.id === paciente.id) ||
            (hora.paciente.id === paciente.id && this.usuario.data.perfil !=="Especialista" )){
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
    turnoFormateado.especialistaObj.id = turno.data.especialista.id
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
  
}
