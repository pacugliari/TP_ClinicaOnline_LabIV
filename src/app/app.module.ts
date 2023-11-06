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
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
