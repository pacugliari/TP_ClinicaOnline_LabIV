import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroAdministradorComponent } from 'src/app/components/registro-administrador/registro-administrador.component';
import { RegistroEspecialistaComponent } from 'src/app/components/registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from 'src/app/components/registro-paciente/registro-paciente.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    RegistroAdministradorComponent,
    RegistroEspecialistaComponent,
    RegistroPacienteComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RegistroRoutingModule,
    MatDialogModule
  ]
})
export class RegistroModule { }
