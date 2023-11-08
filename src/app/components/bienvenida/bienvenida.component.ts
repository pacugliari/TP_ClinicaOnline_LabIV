import { Component } from '@angular/core';
import { RegistroComponent } from '../registro/registro.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent {

  constructor(public dialog: MatDialog){

  }

  registro(){

    const dialogRef = this.dialog.open(RegistroComponent, {
      data: {},
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }
}
