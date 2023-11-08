import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ReCaptchaService } from 'src/app/services/re-captcha.service';
import { auth } from 'src/main';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  cargando: boolean = false;
  admin : any;
  especialistaUno : any;
  especialistaDos : any;
  pacienteUno : any;
  pacienteDos : any;
  pacienteTres : any;
  cargandoAccesoRapido : boolean = false;

  constructor(private formBuilder: FormBuilder,private auth : AuthService,
    private router:Router,private firestore:FirestoreService){

}

async ngOnInit() {
  this.cargandoAccesoRapido = true;
  let ls = localStorage.getItem("usuario");

  if (ls !== undefined && ls !== "undefined") { // Corrección
    let usuario = JSON.parse(ls ? ls : "{}");
    if (usuario && usuario.user) {
      this.router.navigate(["menu"]);
    }
  }

  let usuarios = await this.firestore.obtener("usuarios")
  this.admin = usuarios.filter((usuario:any)=> usuario.data.datos.mail === "kayir90680@rdluxe.com")[0]
  this.especialistaUno = usuarios.filter((usuario:any)=> usuario.data.datos.mail === "hofic50714@othao.com")[0]
  this.especialistaDos = usuarios.filter((usuario:any)=> usuario.data.datos.mail === "jobev73056@othao.com")[0]
  this.pacienteUno = usuarios.filter((usuario:any)=> usuario.data.datos.mail === "konar46411@mkurg.com")[0]
  this.pacienteDos = usuarios.filter((usuario:any)=> usuario.data.datos.mail === "poxici3199@othao.com")[0]
  this.pacienteTres = usuarios.filter((usuario:any)=> usuario.data.datos.mail === "leran30012@othao.com")[0]
  this.cargandoAccesoRapido = false;
}


  form = this.formBuilder.group({
    mail: ['', [Validators.required]],
    clave: ['', [Validators.required]],
  });

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

  async ingresar(){
    this.cargando = true;
    if(this.form.valid){
      let credenciales = (await this.auth.login({email:this.form.value.mail,password:this.form.value.clave}));
      localStorage.setItem("usuario",JSON.stringify(credenciales))
      this.router.navigate(["menu"])
    }else{
      this.marcarCamposRequeridos();
      Swal.fire("ERROR","Verifique los campos ingresados","error");
    }
    this.cargando=false;
  }

  ingresoAdmin(){
    this.form.get("mail")?.setValue(this.admin.data.datos.mail);
    this.form.get("clave")?.setValue(this.admin.data.datos.mail);
  }

  ingresoPacienteUno(){
    this.form.get("mail")?.setValue(this.pacienteUno.data.datos.mail);
    this.form.get("clave")?.setValue(this.pacienteUno.data.datos.mail);
  }

  ingresoPacienteDos(){
    this.form.get("mail")?.setValue(this.pacienteDos.data.datos.mail);
    this.form.get("clave")?.setValue(this.pacienteDos.data.datos.mail);
  }

  ingresoPacienteTres(){
    this.form.get("mail")?.setValue(this.pacienteTres.data.datos.mail);
    this.form.get("clave")?.setValue(this.pacienteTres.data.datos.mail);
  }

  ingresoEspecialistaUno(){
    this.form.get("mail")?.setValue(this.especialistaUno.data.datos.mail);
    this.form.get("clave")?.setValue(this.especialistaUno.data.datos.mail);
  }

  ingresoEspecialistaDos(){
    this.form.get("mail")?.setValue(this.especialistaDos.data.datos.mail);
    this.form.get("clave")?.setValue(this.especialistaDos.data.datos.mail);
  }

  volver(){
    this.router.navigate(["bienvenida"])
  }
}
