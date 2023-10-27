import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { auth } from 'src/main';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class VerificadoGuard implements CanActivate {

  constructor(private router:Router){

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let respuesta = false;
    let ls = localStorage.getItem("usuario");
    if(ls){
      let credenciales = JSON.parse(ls ? ls : "");
      respuesta = credenciales?.user?.emailVerified ? true : false;

      if(!respuesta){
        Swal.fire("ERROR","Debes verificar el mail antes de ingresar","error")
      }
    }else{
      Swal.fire("ERROR","Usuario no autorizado","error")
    }

    if(!respuesta){
      this.router.navigate(["bienvenida"])
    }
    return respuesta;
  }
}
