import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroEspecialistaComponent } from 'src/app/components/registro-especialista/registro-especialista.component';
import { RegistroPacienteComponent } from 'src/app/components/registro-paciente/registro-paciente.component';

const routes: Routes = [
  { path: 'paciente', component: RegistroPacienteComponent},
  { path: 'especialista', component: RegistroEspecialistaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
