import { Component, Inject, Input, Optional } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-datos-perfil',
  templateUrl: './datos-perfil.component.html',
  styleUrls: ['./datos-perfil.component.css']
})
export class DatosPerfilComponent {

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any = null){

    if(this.data){
      this.usuario.data = this.data.datos;
    }

  }

  @Input() usuario : any = {};
}
