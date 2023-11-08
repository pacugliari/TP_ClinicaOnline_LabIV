import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  constructor(private router:Router,private dialogRef:DialogRef){

  }

  ir(ruta:any){
    this.dialogRef.close();
    this.router.navigate([ruta])
  }
}
