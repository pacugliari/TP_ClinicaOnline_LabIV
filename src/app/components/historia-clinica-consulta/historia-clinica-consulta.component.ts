import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatosPerfilComponent } from '../datos-perfil/datos-perfil.component';
import { MatDialog } from '@angular/material/dialog';
import { HistoriaClinicaComponent } from '../historia-clinica/historia-clinica.component';
import { PdfServiceService } from 'src/app/services/pdf-service.service';

@Component({
  selector: 'app-historia-clinica-consulta',
  templateUrl: './historia-clinica-consulta.component.html',
  styleUrls: ['./historia-clinica-consulta.component.css']
})
export class HistoriaClinicaConsultaComponent {

  cargando:boolean = false;
  historiasClinicas : any;
  usuario : any;
  lista : MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  tableDetalle : string[] = ['fecha','paciente','especialista','especialidad','acciones'];

  constructor(private firestore:FirestoreService,private auth: AuthService,public dialog: MatDialog,private pdfService:PdfServiceService){
    this.lista.paginator = this.paginator;
  }

  async ngOnInit(){
    this.historiasClinicas = this.lista.data= await this.firestore.obtener("historiaClinica");
    this.usuario = await this.auth.getUsuarioLogueado();

    if(this.usuario.data.perfil==="Paciente"){
      this.tableDetalle = ['fecha','especialista','especialidad','acciones'];
      this.lista.data = this.historiasClinicas.filter((historia:any)=> historia.data.paciente.id === this.usuario.id)
    }else if (this.usuario.data.perfil==="Especialista"){
      this.tableDetalle = ['fecha','paciente','especialidad','acciones'];
      this.lista.data = this.historiasClinicas.filter((historia:any)=> historia.data.especialista.id === this.usuario.id)
    }
  }

  verEspecialista(historia:any){

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos : historia.data.turno.especialistaObj},
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  async guardarHistoriaClinica(){
    let historias = this.historiasClinicas.filter((historia:any)=> historia.data.paciente.id === this.usuario.id)
    let paciente = historias[0].data.paciente
    console.log(historias)
    console.log(paciente)
    await this.pdfService.generatePdf(paciente,historias);
  }


  verPaciente(historia:any){

    const dialogRef = this.dialog.open(DatosPerfilComponent, {
      data: {datos :  historia.data.turno.pacienteObj},
      width: 'auto',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }

  verHistoria(historia:any){
    const dialogRef = this.dialog.open(HistoriaClinicaComponent, {
      data: {consulta:true,turno:historia.data.turno},
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result:any) => {

    });
  }
  
}
