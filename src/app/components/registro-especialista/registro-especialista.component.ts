import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { EspecialidadesComponent } from '../especialidades/especialidades.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-especialista',
  templateUrl: './registro-especialista.component.html',
  styleUrls: ['./registro-especialista.component.css']
})
export class RegistroEspecialistaComponent {
  imagenes : any;
  yaCargo : boolean = false;
  yaCargoEspecialidad:boolean = false;
  especialidadesSeleccionadas : any[]=[];
  constructor(private formBuilder: FormBuilder,
              private router:Router,private auth:AuthService,private firestore:FirestoreService,private storage:StorageService,
              public dialog: MatDialog){
    
  }
  
  form = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    edad: ['',[Validators.required]],
    dni: ['', [Validators.required]],
    mail: ['', [Validators.required]],
    clave: ['', [Validators.required]],
    especialidades: [''],
  });

  imagenCargada(event:any){
    this.yaCargo = true;
    const input = event.target as HTMLInputElement;
    this.imagenes = input.files;
  }

  marcarCamposRequeridos(){
    const formControls = this.form.controls as { [key: string]: AbstractControl };
    Object.keys(formControls).forEach((controlName:any) => {
      const control = formControls[controlName];
      control.markAsTouched();
      if (control.invalid) {
        control.setErrors({ 'required': true });
      }
    });
  }

  async enviar(){

    if(this.form.valid && (this.imagenes ? this.imagenes.length : 0 ) === 1 && this.especialidadesSeleccionadas.length >= 1){
      let credenciales = await this.auth.register({email:this.form.value.mail,password:this.form.value.clave})
      let fotos : string[] = [];

      for (let i = 0; i < this.imagenes.length; i++) {
        fotos.push(await this.storage.guardarFoto(this.imagenes[i],"usuarios"))
      }

      this.form.get("especialidades")?.setValue(JSON.stringify(this.especialidadesSeleccionadas.map((element)=> element.nombre)))

      let usuario = {
        datos : this.form.value,
        perfil: "Especialista",
        credenciales: JSON.stringify(credenciales),
        fotos: fotos
      }
      this.firestore.guardar(usuario,"usuarios")
    }else{
      this.marcarCamposRequeridos();
      Swal.fire("ERROR","Verifique los campos ingresados","error");
    }
  }

  volver(){
    this.router.navigate(["bienvenida"])
  }

  seleccionarEspecialidades(): void {
    const dialogRef = this.dialog.open(EspecialidadesComponent, {
      data: { lista: this.especialidadesSeleccionadas},
      width: '1000px',
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      this.especialidadesSeleccionadas = result;
      console.log(this.especialidadesSeleccionadas)
      this.yaCargoEspecialidad = true;
    });
  }
}
