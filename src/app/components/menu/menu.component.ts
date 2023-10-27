import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  constructor(private auth:AuthService,private router:Router){

  }

  salir(){
    this.router.navigate(["bienvenida"])
    this.auth.logout();
  }
}
