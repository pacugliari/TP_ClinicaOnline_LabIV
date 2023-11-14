import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css']
})
export class HistoriaClinicaComponent {
  form: FormGroup;
  indice :number = 0;
  historiasClinicas : any;
  historiaBuscada : any;

  constructor(private formBuilder: FormBuilder,public dialogRef : MatDialogRef<HistoriaClinicaComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,private firestore:FirestoreService) {

    this.form = this.formBuilder.group({
      altura: [null, [Validators.required,Validators.min(100), Validators.max(250)]],
      peso: [null, [Validators.required,Validators.min(50), Validators.max(200)]],
      temperatura: [null, [Validators.required,Validators.min(30), Validators.max(45)]],
      presion: [null, Validators.required],
      claveUno: [null,],
      valorUno: [null, ],
      claveDos: [null,],
      valorDos: [null,],
      claveTres: [null,],
      valorTres: [null,],
    });
    console.log(this.data.consulta)
  }

  async ngOnInit(){
    this.historiasClinicas = await this.firestore.obtener("historiaClinica");

    if(this.data.turno.pacienteObj.id){
      this.historiaBuscada = this.historiasClinicas.filter((historia:any)=> historia.data.paciente.id === this.data.turno.pacienteObj.id)[0]
      if(this.historiaBuscada){
        this.form.get("altura")?.setValue(this.historiaBuscada.data.altura)
        this.form.get("peso")?.setValue(this.historiaBuscada.data.peso)
        this.form.get("temperatura")?.setValue(this.historiaBuscada.data.temperatura)
        this.form.get("presion")?.setValue(this.historiaBuscada.data.presion)
        //DINAMICOS
        if(this.historiaBuscada.data.claveUno){
          this.indice++;
          this.form.get("claveUno")?.setValue(this.historiaBuscada.data.claveUno)
          this.form.get("valorUno")?.setValue(this.historiaBuscada.data.valorUno)
        }
        if(this.historiaBuscada.data.claveDos){
          this.indice++;
          this.form.get("claveDos")?.setValue(this.historiaBuscada.data.claveDos)
          this.form.get("valorDos")?.setValue(this.historiaBuscada.data.valorDos)
        }
        if(this.historiaBuscada.data.claveTres){
          this.indice++;
          this.form.get("claveTres")?.setValue(this.historiaBuscada.data.claveTres)
          this.form.get("valorTres")?.setValue(this.historiaBuscada.data.valorTres)
        }

      }
    }
  }

  agregarDato(){

    if(this.indice !== 3)
      this.indice++;

    switch(this.indice){
      case 1:
        this.form.get("claveUno")?.addValidators(Validators.required)
        this.form.get("valorUno")?.addValidators(Validators.required)
        break;
      case 2:
        this.form.get("claveDos")?.addValidators(Validators.required)
        this.form.get("valorDos")?.addValidators(Validators.required)
        break;
      case 3:
        this.form.get("claveTres")?.addValidators(Validators.required)
        this.form.get("valorTres")?.addValidators(Validators.required)
        break;
    }

  }

  async guardar(){
    let retorno = false;
    if(this.form.valid){
      let data = this.form.value

      if(this.historiaBuscada){
        this.historiaBuscada.data = data
        await this.firestore.modificar(this.historiaBuscada,"historiaClinica")
        retorno = true;
      }else{
        data.especialidad = this.data.turno.especialidad
        data.fecha = this.data.turno.fecha
        data.especialista = this.data.turno.especialistaObj
        data.paciente =  this.data.turno.pacienteObj
        data.turno = this.data.turno
        await this.firestore.guardar(data,"historiaClinica")
        retorno = true;
      }
    }

    this.dialogRef.close(retorno)

  }
}
