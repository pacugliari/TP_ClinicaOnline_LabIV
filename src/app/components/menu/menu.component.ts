import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  pestania: number = -1;
  perfilActual : string = "";

  constructor(private auth:AuthService,private router:Router){

  }

  async ngOnInit(){
    let ls = localStorage.getItem("usuario");
    let credenciales = JSON.parse(ls ? ls : "{}");
    let usuario = (await this.auth.obtetenerUsuarioLogueadoBase(credenciales.user.uid))
    this.perfilActual = usuario.data.perfil;

  }

  verSeccionUsuario(){
    this.pestania = 0;
  }

  verMiPerfil(){
    this.pestania = 1;
  }

  verSolicitarTurno(){
    this.pestania = 2;
  }

  verTurnos(){
    this.pestania = 3;
  }

  verPacientes(){
    this.pestania = 4;
  }


  salir(){
    this.router.navigate(["bienvenida"])
    this.auth.logout();
  }
}
