import { Component, Input, Optional } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { EspecialidadesComponent } from '../especialidades/especialidades.component';

@Component({
  selector: 'app-formulario-especialista',
  templateUrl: './formulario-especialista.component.html',
  styleUrls: ['./formulario-especialista.component.css']
})
export class FormularioEspecialistaComponent {
  imagenes : any;
  yaCargo : boolean = false;
  yaCargoEspecialidad:boolean = false;
  especialidadesSeleccionadas : any[]=[];
  @Input() mostrarVolver : boolean = false;

  constructor(private formBuilder: FormBuilder,
              private router:Router,private auth:AuthService,private firestore:FirestoreService,private storage:StorageService,
              public dialog: MatDialog,@Optional() public dialogRef: MatDialogRef<FormularioEspecialistaComponent>){
    
  }
  
  form = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    edad: ['',[Validators.required,Validators.min(18),Validators.max(99)]],
    dni: ['', [Validators.required,Validators.pattern('^[0-9]{1,3}\?[0-9]{3,3}\?[0-9]{3,3}$')]],
    mail: ['', [Validators.required,Validators.email]],
    clave: ['', [Validators.required,Validators.minLength(6)]],
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
        cuentaAprobada: false,
        credenciales: JSON.stringify(credenciales),
        fotos: fotos
      }
      this.firestore.guardar(usuario,"usuarios")
    }else{
      this.marcarCamposRequeridos();
      Swal.fire("ERROR","Verifique los campos ingresados","error");
    }

    if(this.dialogRef){
      this.dialogRef.close();
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
