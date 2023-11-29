import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistroRoutingModule } from './registro-routing.module';
import { RegistroAdministradorComponent } from 'src/app/components/registro-administrador/registro-administrador.component';
import { RegistroEspecialistaComponent } from 'src/app/components/registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from 'src/app/components/registro-paciente/registro-paciente.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { FormularioEspecialistaComponent } from 'src/app/components/formulario-especialista/formulario-especialista.component';
import { MatCardModule } from '@angular/material/card';
import { FormularioPacienteComponent } from 'src/app/components/formulario-paciente/formulario-paciente.component';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompartidoModule } from '../compartido/compartido.module';

@NgModule({
  declarations: [
    RegistroAdministradorComponent,
    RegistroEspecialistaComponent,
    RegistroPacienteComponent,
    FormularioEspecialistaComponent,
    FormularioPacienteComponent,
  ],
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    RegistroRoutingModule,
    MatDialogModule,
    RecaptchaModule,
    MatProgressSpinnerModule,
    CompartidoModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6LeJ0wIpAAAAAPJTqzDVzVEqZhdaFSJn6eDaiIWi' } // Reemplaza con tu clave del sitio
    },
    { provide: RECAPTCHA_LANGUAGE, useValue: 'es' } // Opcional: Cambia el idioma si es necesario
  ]
})
export class RegistroModule { }
