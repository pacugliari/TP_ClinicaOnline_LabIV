import { Injectable } from '@angular/core';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from 'src/main';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async guardarFoto(dataUrl:any,ruta:string){
    let hora = new Date().getTime();//obtengo hora actual
    let ubicacion = "/"+ruta+"/"+ hora;//le digo la ubicacion de la foto en el firebaseStorage
    const imgRef = ref(storage,ubicacion)
    
    return await uploadBytes(imgRef,dataUrl).then(async()=>{
      return await getDownloadURL(imgRef)
        .then( async (imgUrl) => {
          return imgUrl;
       });
    })
  }


}
