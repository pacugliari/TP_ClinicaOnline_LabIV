import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ReCaptchaService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  verificar(token:any) : Promise<boolean> {
    return new Promise<boolean>((resolve,reject)=>{
      this.http.post('https://pac-clinica.netlify.app/.netlify/functions/api/verify-recaptcha', { token: token },this.httpOptions)
      .subscribe((response:any) => {
        //console.log(response);
        if(response.correcto)
          resolve(response.correcto)
        else
          reject(response.correcto)

      });
    })
  }
}
