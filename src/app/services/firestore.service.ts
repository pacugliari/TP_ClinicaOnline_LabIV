import { Injectable } from '@angular/core';
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';
import { firestore } from 'src/main';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }

  guardar(data:any,ruta:string){
    const colRef = collection(firestore,ruta);
    return addDoc(colRef,data); 
  }

  async modificar (data: any,ruta:string){
    let retorno = false;
    const usuarioRef = collection(firestore,ruta);
      const documento = doc(usuarioRef,data.id)
      await updateDoc(documento,data.data)
        .then((respuesta)=>{
          retorno = true;
        })
        .catch((error) => {
      });
      return retorno;
  }

  
  async obtener(ruta:string)
  {
    let array :any[]=[];
    const querySnapshot = await getDocs(collection(firestore,ruta));
    querySnapshot.forEach((doc) => {
      let data = {
        id : doc.id,
        data : doc.data()
      }
      array.push(data);
    });
    return array;
    
  }

  escucharCambios (ruta:string, callback: (data: any[]) => void) {
    let datos :any[]=[];
    const q = query(collection(firestore, ruta));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      datos = [];
      querySnapshot.forEach((doc:any) => {
        let data = {
          id : doc.id,
          data : doc.data()
        }
        datos.push(data);
      });
      callback(datos);
    });
    return datos;
  }
}
