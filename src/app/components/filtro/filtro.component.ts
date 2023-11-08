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

  esEspecialista : boolean = false;

  
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any = null,private formBuilder:FormBuilder,
    public dialog: MatDialog,public dialogRef: MatDialogRef<FiltroComponent>){
      //console.log(this.data);

  }

  async ngOnInit(){

    this.listaEspecialidades.data = this.especialidades
    this.listaPacientes.data = this.pacientes
    this.listaEspecialistas.data = this.especialistas

    let turnos = this.data.turnos
    let aux: any[] = [];
    let aux2: any[] = [];

    if(this.data.usuario.data.perfil === "Especialista"){
        this.esEspecialista = true;

        turnos.forEach((turno:any) => {

          if(!aux.includes(turno.especialidadObj.nombre)){
            aux.push(turno.especialidadObj.nombre)
            this.especialidades.push(turno.especialidadObj)
          }

          if(!aux2.includes(turno.pacienteObj.datos.apellido)){
            aux2.push(turno.pacienteObj.datos.apellido)
            turno.pacienteObj.estaMarcado = false;
            this.pacientes.push(turno.pacienteObj)
          }

          //console.log(turno.especialidadObj)
          //console.log(turno.pacienteObj)
        });
    }else{


      turnos.forEach((turno:any) => {

        if(!aux.includes(turno.especialidadObj.nombre)){
          aux.push(turno.especialidadObj.nombre)
          this.especialidades.push(turno.especialidadObj)
        }

        if(!aux2.includes(turno.especialistaObj.datos.apellido)){
          aux2.push(turno.especialistaObj.datos.apellido)
          turno.especialistaObj.estaMarcado = false;
          this.especialistas.push(turno.especialistaObj)
        }

        //console.log(turno.especialistaObj)
        //console.log(turno.pacienteObj)
      });
    }
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

  verPersona(turno:any){

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos : turno},
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  filtrarEspecialidades(){
    this.listaEspecialidades.data = this.especialidades.filter((element: any) => {
      const nombreEspecialidad = element.nombre.toLowerCase();
      const filtro = this.form.value.especialidad?.toLowerCase();
      return nombreEspecialidad.includes(filtro); 
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


    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.data.turnos)
  }
}
