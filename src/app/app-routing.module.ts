import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { VerificadoGuard } from './guards/verificado.guard';
import { SeccionUsuariosComponent } from './components/seccion-usuarios/seccion-usuarios.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/bienvenida' },
  { path: 'bienvenida', component: BienvenidaComponent},
  { path: 'menu', component: MenuComponent,canActivate: [VerificadoGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'registro', loadChildren: () => import('./modulos/registro/registro.module').then(m => m.RegistroModule) },
  { path: '**', component: BienvenidaComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
