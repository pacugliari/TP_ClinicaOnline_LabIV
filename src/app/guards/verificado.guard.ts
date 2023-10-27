import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { auth } from 'src/main';
import Swal from 'sweetalert2';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerificadoGuard implements CanActivate {

  constructor(private router:Router,private firestore:FirestoreService,private auth:AuthService){

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let respuesta = false;
    let ls = localStorage.getItem("usuario");

    if(ls !== undefined && ls !== "undefined" && ls !== null){
      let credenciales = JSON.parse(ls ? ls : "");
      let usuario = (await this.auth.obtetenerUsuarioLogueadoBase(credenciales.user.uid));

      respuesta = credenciales?.user?.emailVerified ? true : false;

      if(!respuesta){
        Swal.fire("ERROR","Debes verificar el mail antes de ingresar","error")
      }

      if(respuesta && usuario.data.perfil === "Especialista"){
        respuesta = usuario.data.cuentaAprobada ? true : false
        if(!respuesta){
          Swal.fire("ERROR","Su cuenta de especialista debe ser aprobada por un administrador","error")
        }
      }
      
    }else{
      Swal.fire("ERROR","Usuario no autorizado","error")
    }

    if(!respuesta){
      localStorage.clear();
      this.router.navigateByUrl('/refresh', {skipLocationChange: true}).then(()=> this.router.navigate(["login"]));
    }
    return respuesta;
  }
}
