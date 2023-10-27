import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from 'src/main';
import Swal from 'sweetalert2';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestore:FirestoreService) { }

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

  async obtetenerUsuarioLogueadoBase(uid: any){
    let retorno : any;
    let usuarios = await this.firestore.obtener("usuarios");
      usuarios.forEach((element : any) => {
        let credencialesBase = JSON.parse(element.data.credenciales ? element.data.credenciales : "{}")
        if(credencialesBase.user.uid === uid){
          retorno = element;
        }
      });
    return retorno;
  }

  async login({email,password}:any){

      return signInWithEmailAndPassword(auth,email,password)
        .catch((error)=>{ 
          Swal.fire("ERROR","Usuario no autorizado","error");
        })

  }

  logout(){
      localStorage.clear();
      return signOut(auth);
  }
}
