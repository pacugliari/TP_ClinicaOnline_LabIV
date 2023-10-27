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

  habilitarSeccionUsuarios : boolean = false;
  perfilActual : string = "";

  constructor(private auth:AuthService,private router:Router){

  }

  async ngOnInit(){
    let ls = localStorage.getItem("usuario");
    let credenciales = JSON.parse(ls ? ls : "{}");
    let usuario = (await this.auth.obtetenerUsuarioLogueadoBase(credenciales.user.uid))
    if(usuario.data.perfil === "Administrador"){
      this.perfilActual = "Administrador";
    }
  }

  verSeccionUsuario(){
    this.habilitarSeccionUsuarios = !this.habilitarSeccionUsuarios;
  }

  salir(){
    this.router.navigate(["bienvenida"])
    this.auth.logout();
  }
}
