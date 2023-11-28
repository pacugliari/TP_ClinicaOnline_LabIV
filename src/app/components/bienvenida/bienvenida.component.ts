import { Component } from '@angular/core';
import { RegistroComponent } from '../registro/registro.component';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css'],
  animations: [
    trigger('fadeAndScale', [
      state('void', style({ opacity: 0, transform: 'scale(0.5)' })),
      transition(':enter, :leave', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
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
