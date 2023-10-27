import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { auth } from 'src/main';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  cargando: boolean = false;

  constructor(private formBuilder: FormBuilder,private auth : AuthService,
    private router:Router){

}

ngOnInit() {
  let ls = localStorage.getItem("usuario");

  if (ls !== undefined && ls !== "undefined") { // Corrección
    let usuario = JSON.parse(ls ? ls : "{}");
    if (usuario && usuario.user) {
      this.router.navigate(["menu"]);
    }
  }
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

  admin(){
    this.form.get("mail")?.setValue("yitecel839@wanbeiz.com");
    this.form.get("clave")?.setValue("yitecel839@wanbeiz.com");
  }

  paciente(){
    this.form.get("mail")?.setValue("wilope3602@soebing.com");
    this.form.get("clave")?.setValue("wilope3602@soebing.com");
  }

  especialista(){
    this.form.get("mail")?.setValue("gikerax403@soebing.com");
    this.form.get("clave")?.setValue("gikerax403@soebing.com");
  }

  volver(){
    this.router.navigate(["bienvenida"])
  }
}
