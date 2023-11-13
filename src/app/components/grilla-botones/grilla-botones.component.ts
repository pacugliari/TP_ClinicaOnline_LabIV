

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grilla-botones',
  templateUrl: './grilla-botones.component.html',
  styleUrls: ['./grilla-botones.component.css']
})
export class GrillaBotonesComponent {
  especialidades:any;
  especialistas : any;
  pacientes : any;
  especialistasFiltrados: any;
  especialidadSeleccionada : any;
  especialistaSeleccionado : any;
  cargando : boolean = false;
  indice = 0;
  usuario:any;

  constructor(private firestore:FirestoreService,public dialogRef : MatDialogRef<GrillaBotonesComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private auth: AuthService){
  }

  async ngOnInit(){
    this.cargando = true;
    this.especialidades = await this.firestore.obtener("especialidades");
    let usuarios = await this.firestore.obtener("usuarios");
    this.especialistas = usuarios.filter((element : any)=> element.data.perfil === "Especialista")
    this.pacientes = usuarios.filter((element : any)=> element.data.perfil === "Paciente")
    this.usuario = await this.auth.getUsuarioLogueado();
    this.cargando = false;
  }

  seleccionarEspecialidad(especialidad : any){

    this.especialidadSeleccionada = especialidad;
    this.especialistasFiltrados = this.especialistas.filter((element:any)=> element.data.datos.especialidades.includes(especialidad.data.nombre));

    if(this.especialistasFiltrados.length === 0){
      Swal.fire("","No hay especialistas para esa especialidad","info")
      this.dialogRef.close({})
    }else{
      this.indice = 1;
    }
  }

  seleccionarEspecialista(especialista : any){
    this.especialistaSeleccionado = especialista;

    if(this.usuario.data.perfil === "Administrador"){
      this.indice = 2;
    }else{
      this.dialogRef.close({especialista:especialista,especialidad:this.especialidadSeleccionada})
    }
  }

  seleccionarPaciente(paciente : any){
    
    this.dialogRef.close({especialista:this.especialistaSeleccionado,especialidad:this.especialidadSeleccionada,paciente:paciente})
  }
}
