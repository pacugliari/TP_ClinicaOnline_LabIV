import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.css']
})
export class SolicitarTurnoComponent {

  especialidades : any;
  especialistas : any;
  especialistasFiltrados : any;
  horarios : any ;
  turnosCargados:any;


  constructor(private firestore:FirestoreService,private formBuilder :FormBuilder){
    
  }

  
  form = this.formBuilder.group({
    especialidad: ['' as unknown as any,[]],
    especialista: ['' as unknown as any,[]],
  });

  async ngOnInit(){
    this.especialidades = await this.firestore.obtener("especialidades");
    this.especialistas = await this.firestore.obtener("usuarios");
    this.especialistasFiltrados = this.especialistas = this.especialistas.filter((element : any)=> element.data.perfil === "Especialista")
    
  }

  public selectEspecialidad = function (option: any, value: any): boolean {

    if (value == null) {
      return false;
    }
    return option.id === value.id;
  }

  public selectEspecialista = function (option: any, value: any): boolean {

    if (value == null) {
      return false;
    }
    
    return option.id === value.id;
  }

  filtrarEspecialista(){
    this.especialistasFiltrados = this.especialistas.filter((element:any)=> element.data.datos.especialidades.includes(this.form.value.especialidad.data.nombre));

  }

  async traerHorarios(){
    this.turnosCargados = await this.firestore.obtener("turnos");
    this.turnosCargados = this.turnosCargados.filter((element : any)=> element.data.especialista.id ===  this.form.value.especialista.id)

    this.horarios = await this.firestore.obtener("horarios");
    this.horarios = this.horarios.filter((element:any)=> element.data.especialista.id === this.form.value.especialista.id)
    
    if(this.horarios[0]?.data?.horariosCalculados){
      this.horarios[0].data.horariosCalculados = this.horarios[0]?.data?.horariosCalculados.filter((element:any)=> {
        element.horas = element.horas.filter((hora: any) => {
          return this.verificarDisponibilidadHorario(element.dia, hora);
        });
        return element;
      })
    }
  }

   verificarDisponibilidadHorario(dia:any,hora:any){
    let retorno = true;

    for (let i = 0; i< this.turnosCargados.length; i++) {
      for (let k = 0; k < this.turnosCargados[i].data.dia.length; k++) {
        if(this.turnosCargados[i].data.dia[k].descripcion === dia){
          for (let j = 0; j < this.turnosCargados[i].data.dia[k].hora.length; j++) {
            if(this.turnosCargados[i].data.dia[k].hora[j].horario.includes(hora.horario)){
              retorno = false;
              break;
            }
          }
        }
        if (!retorno) {
          break;
        }
      }
      if (!retorno) {
        break;
      }
    }
    return retorno;
  }

  async cargarTurno(dia:any,hora:any){
    hora.disponible = false;

    let turnosCargados = await this.firestore.obtener("turnos");
    turnosCargados = turnosCargados.filter((element : any)=> element.data.especialista.id ===  this.form.value.especialista.id)

    if(turnosCargados.length){
      let diaCargado : boolean = false;
      turnosCargados[0].data.dia.forEach((element:any) => {
        if(element.descripcion.includes(dia))
          diaCargado = true;
      });

      
      if(!diaCargado){
        turnosCargados[0].data.dia.push({descripcion:dia,hora: [hora]});
      }else{
        turnosCargados[0].data.dia.forEach((element:any) => {
          if(element.descripcion.includes(dia)){
            element.hora.push(hora)
          }
        });
      } 

      await this.firestore.modificar({id:turnosCargados[0].id,data:turnosCargados[0].data},"turnos")
    }else{
      let data = {
        especialista: this.form.value.especialista,
        dia: [{descripcion:dia,hora: [hora]}]
      }
      await this.firestore.guardar(data,"turnos");
    }
    await this.traerHorarios();
    Swal.fire("OK","Turno solicitado de manera correcta","success");
  }
}
