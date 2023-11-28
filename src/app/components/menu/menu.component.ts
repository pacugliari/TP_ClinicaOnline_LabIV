import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('slideInRight', [
      state('void', style({
        transform: 'translateX(100%)',
      })),
      state('*', style({
        transform: 'translateX(0)',
      })),
      transition('void => *', animate('500ms ease-in-out')),
    ]),
  ],
})
export class MenuComponent {

  pestania: number = 1;
  perfilActual : string = "";
  usuario :any;
  cargando:boolean = false;

  constructor(private auth:AuthService,private router:Router){

  }

  async ngOnInit(){
    this.cargando = true;
    let ls = localStorage.getItem("usuario");
    let credenciales = JSON.parse(ls ? ls : "{}");
    this.usuario = (await this.auth.obtetenerUsuarioLogueadoBase(credenciales.user.uid))
    this.perfilActual = this.usuario.data.perfil;
    this.cargando = false;
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

  verTurnos(event?:any){
    this.pestania = 3;
  }

  verPacientes(){
    this.pestania = 4;
  }


  salir(){
    //this.router.navigate(["bienvenida"])
    this.auth.logout();
  }
}
