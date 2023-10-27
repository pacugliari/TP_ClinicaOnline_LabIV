import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from 'src/main';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async register({email,password}:any){

    return (await createUserWithEmailAndPassword(auth,email,password)
      .then(async (resultado)=>{
        if(auth.currentUser)
          (await sendEmailVerification(auth.currentUser)
            .then((resultado)=>{
                Swal.fire("OK","Mail de verificacion enviado, verifiquelo para ingresar","success");
            })
            .catch((error)=>{
              Swal.fire("ERROR","No se pudo enviar el mail de confirmacion","error");
            }))
            return resultado;
      })
      .catch((error)=>{
        console.log(error)
        Swal.fire("ERROR","No se pudo crear el usuario","error");
      }))
  }

  login({email,password}:any){
      return signInWithEmailAndPassword(auth,email,password);
  }

  logout(){
      localStorage.clear();
      return signOut(auth);
  }
}
