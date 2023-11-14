import { Component, Inject, Optional, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { DatosPerfilComponent } from '../datos-perfil/datos-perfil.component';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.css']
})
export class FiltroComponent {

  tableEspecialidades : string[] = ['especialidad','check'];
  listaEspecialidades : MatTableDataSource<any> = new MatTableDataSource<any>();
  especialidades: any[]=[];

  tablePacientes : string[] = ['paciente','check'];
  listaPacientes : MatTableDataSource<any> = new MatTableDataSource<any>();
  pacientes: any[]=[];

  tableEspecialistas : string[] = ['especialista','check'];
  listaEspecialistas : MatTableDataSource<any> = new MatTableDataSource<any>();
  especialistas: any[]=[];

  tableFechas : string[] = ['fecha','check'];
  listaFechas : MatTableDataSource<any> = new MatTableDataSource<any>();
  fechas: any[]=[];

  tableEstados : string[] = ['estado','check'];
  listaEstados : MatTableDataSource<any> = new MatTableDataSource<any>();
  estados: any[]=[];

  esEspecialista : boolean = false;
  indice = 0;
  
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any = null,private formBuilder:FormBuilder,
    public dialog: MatDialog,public dialogRef: MatDialogRef<FiltroComponent>){
      //console.log(this.data);

  }

  async ngOnInit(){

    this.listaEspecialidades.data = this.especialidades
    this.listaPacientes.data = this.pacientes
    this.listaEspecialistas.data = this.especialistas
    this.listaFechas.data = this.fechas
    this.listaEstados.data = this.estados

    let turnos = this.data.turnos
    let aux: any[] = [];//ESPECIALIDADES
    let aux2: any[] = [];//PACIENTES
    let aux3: any[] = [];//FECHAS
    let aux4: any[] = [];//HORARIOS
    let aux5: any[] = [];//ESTADOS

    turnos.forEach((turno:any) => {
      if(!aux.includes(turno.especialidadObj.nombre)){
        aux.push(turno.especialidadObj.nombre)
        this.especialidades.push(turno.especialidadObj)
      }

      if(!aux3.includes(this.formatearFecha(turno.fecha))){
        aux3.push(this.formatearFecha(turno.fecha))
        turno.fecha.estaMarcado = false;
        this.fechas.push(turno.fecha)
      }

      if(!aux5.includes(turno.estado)){
        aux5.push(turno.estado)
        this.estados.push({estado:turno.estado,estaMarcado:false})
      }

      if(this.data.usuario.data.perfil === "Especialista"){
        this.esEspecialista = true;
        if(!aux2.includes(turno.pacienteObj.datos.apellido)){
          aux2.push(turno.pacienteObj.datos.apellido)
          turno.pacienteObj.estaMarcado = false;
          this.pacientes.push(turno.pacienteObj)
        }
      }else{
        if(!aux2.includes(turno.especialistaObj.datos.apellido)){
          aux2.push(turno.especialistaObj.datos.apellido)
          turno.especialistaObj.estaMarcado = false;
          this.especialistas.push(turno.especialistaObj)
        }
      }
      
      //console.log(turno.especialidadObj)
      //console.log(turno.pacienteObj)
    });

  }

  formatearFecha (fecha1: Date): string {
    return (fecha1.getDate().toString()+fecha1.getMonth().toString()+ fecha1.getFullYear().toString());
  }

  form = this.formBuilder.group({
    especialidad: ['',[]],
  });

  formPaciente = this.formBuilder.group({
    paciente: ['',[]],
  })

  formEspecialista = this.formBuilder.group({
    especialista: ['',[]],
  })

  formFecha = this.formBuilder.group({
    fecha: ['',[]],
  })

  formEstado = this.formBuilder.group({
    estado: ['',[]],
  })

  verPersona(turno:any){

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos : turno},
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  verEspecialidades(){
    this.indice = 0;
  }

  verPacientes(){
    this.indice = 1;
  }

  verEspecialistas(){
    this.indice = 2;
  }

  verFechas(){
    this.indice = 3;
  }

  verHorarios(){
    this.indice = 4;
  }

  verEstados(){
    this.indice = 5;
  }



  filtrarEspecialidades(){
    this.listaEspecialidades.data = this.especialidades.filter((element: any) => {
      const nombreEspecialidad = element.nombre.toLowerCase();
      const filtro = this.form.value.especialidad?.toLowerCase();
      return nombreEspecialidad.includes(filtro); 
    });
  }

  filtrarEstados(){
    this.listaEstados.data = this.estados.filter((element: any) => {
      const estado = element.estado.toLowerCase();
      const filtro = this.formEstado.value.estado?.toLowerCase();
      return estado.includes(filtro); 
    });
  }

  filtrarFecha(){
    this.listaFechas.data = this.fechas.filter((element: any) => {
      const opcionesDeFormato = { month: 'short', day: 'numeric', year: 'numeric' };
      const fecha = element.toLocaleDateString('en-US', opcionesDeFormato).toLowerCase();
      const filtro = this.formFecha.value.fecha?.toLowerCase() ? this.formFecha.value.fecha?.toLowerCase() : "";
      return fecha.includes(filtro); 
    });
  }

  filtrarPacientes(){
    this.listaPacientes.data = this.pacientes.filter((element: any) => {
      const apellidoPaciente = element.datos.apellido.toLowerCase();
      const filtro = this.formPaciente.value.paciente?.toLowerCase();
      return apellidoPaciente.includes(filtro);
    });
  }

  filtrarEspecialista(){
    this.listaEspecialistas.data = this.especialistas.filter((element: any) => {
      const apellidoEspecialista = element.datos.apellido.toLowerCase();
      const filtro = this.formEspecialista.value.especialista?.toLowerCase();
      return apellidoEspecialista.includes(filtro);
    });
  }

  filtrar(){
    let especialidadesMarcadas = this.especialidades.filter((especialidad:any)=> especialidad.estaMarcado)
    let pacientesMarcados = this.pacientes.filter((especialidad:any)=> especialidad.estaMarcado)
    let especialistasMarcados = this.especialistas.filter((especialista:any)=> especialista.estaMarcado)
    let fechasMarcadas = this.fechas.filter((fecha:any)=> fecha.estaMarcado)
    let estadosMarcados = this.estados.filter((estado:any)=> estado.estaMarcado)

    if(especialidadesMarcadas.length > 0){
      this.data.turnos = this.data.turnos.filter((turno:any)=>{
        return especialidadesMarcadas.some((especialidad: any) =>
        turno.especialidadObj.id === especialidad.id
      );
      })
    }

    if(pacientesMarcados.length > 0 && this.esEspecialista){
      this.data.turnos = this.data.turnos.filter((turno:any)=>{
        return pacientesMarcados.some((paciente: any) =>
        turno.pacienteObj.id === paciente.id
      );
      })
    }

    if(especialistasMarcados.length > 0 && !this.esEspecialista){
      this.data.turnos = this.data.turnos.filter((turno:any)=>{
        return especialistasMarcados.some((especialista: any) =>
        turno.especialistaObj.id === especialista.id
      );
      })
    }

    if(fechasMarcadas.length > 0){
      this.data.turnos = this.data.turnos.filter((turno:any)=>{
        return fechasMarcadas.some((fecha: any) =>
        this.formatearFecha(turno.fecha) ===  this.formatearFecha(fecha)
      );
      })
    }

    if(estadosMarcados.length > 0){
      this.data.turnos = this.data.turnos.filter((turno:any)=>{
        return estadosMarcados.some((estado: any) =>
        turno.estado ===  estado.estado
      );
      })
    }


    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.data.turnos)
  }
}
