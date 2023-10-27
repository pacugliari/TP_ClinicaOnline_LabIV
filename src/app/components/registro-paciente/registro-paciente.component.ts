import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-paciente',
  templateUrl: './registro-paciente.component.html',
  styleUrls: ['./registro-paciente.component.css']
})
export class RegistroPacienteComponent {
  
  imagenes : any;
  yaCargo : boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router:Router,private auth:AuthService,private firestore:FirestoreService,private storage:StorageService){
    
  }
  
  form = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    edad: ['',[Validators.required]],
    dni: ['', [Validators.required]],
    obraSocial: ['',[Validators.required]],
    mail: ['', [Validators.required]],
    clave: ['', [Validators.required]],
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
    

    if(this.form.valid && (this.imagenes ? this.imagenes.length : 0 ) === 2){
      let credenciales = await this.auth.register({email:this.form.value.mail,password:this.form.value.clave})
      let fotos : string[] = [];

      for (let i = 0; i < this.imagenes.length; i++) {
        fotos.push(await this.storage.guardarFoto(this.imagenes[i],"usuarios"))
      }

      let usuario = {
        datos : this.form.value,
        perfil: "Paciente",
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
}
