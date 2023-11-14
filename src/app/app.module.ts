import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { LoginComponent } from './components/login/login.component';
import { SeccionUsuariosComponent } from './components/seccion-usuarios/seccion-usuarios.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './components/menu/menu.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SolicitarTurnoComponent } from './components/solicitar-turno/solicitar-turno.component';
import { DoctorPipe } from './pipes/doctor.pipe';
import { TurnosComponent } from './components/turnos/turnos.component';
import { DatosPerfilComponent } from './components/datos-perfil/datos-perfil.component';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings, RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { HttpClientModule } from '@angular/common/http';
import { FiltroComponent } from './components/filtro/filtro.component';
import { RegistroComponent } from './components/registro/registro.component';
import { EncuestaComponent } from './components/encuesta/encuesta.component';
import { EncuestaAtencionComponent } from './components/encuesta-atencion/encuesta-atencion.component';
import { MatSliderModule } from '@angular/material/slider';
import { GrillaBotonesComponent } from './components/grilla-botones/grilla-botones.component';
import { FechaPipe } from './pipes/fecha.pipe';
import { HistoriaClinicaComponent } from './components/historia-clinica/historia-clinica.component';
import { HistoriaClinicaConsultaComponent } from './components/historia-clinica-consulta/historia-clinica-consulta.component';

@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    LoginComponent,
    SeccionUsuariosComponent,
    MenuComponent,
    EspecialidadesComponent,
    MiPerfilComponent,
    SolicitarTurnoComponent,
    DoctorPipe,
    TurnosComponent,
    DatosPerfilComponent,
    FiltroComponent,
    RegistroComponent,
    EncuestaComponent,
    EncuestaAtencionComponent,
    GrillaBotonesComponent,
    FechaPipe,
    HistoriaClinicaComponent,
    HistoriaClinicaConsultaComponent,
  ],
  imports: [
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    BrowserModule,
    RecaptchaModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    HttpClientModule,
    MatSliderModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: '6LeJ0wIpAAAAAPJTqzDVzVEqZhdaFSJn6eDaiIWi' } // Reemplaza con tu clave del sitio
    },
    { provide: RECAPTCHA_LANGUAGE, useValue: 'es' } // Opcional: Cambia el idioma si es necesario
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
