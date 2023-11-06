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
  diasDeLaSemana = ["domingo","lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

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
    this.form.get("especialista")?.reset();
    this.especialistasFiltrados = this.especialistas.filter((element:any)=> element.data.datos.especialidades.includes(this.form.value.especialidad.data.nombre));

  }

  async traerHorarios(){
    this.turnosCargados = await this.firestore.obtener("turnos");
    this.turnosCargados = this.turnosCargados.filter((element : any)=> element.data.especialista.id ===  this.form.value.especialista.id)

    //FILTRO POR ESPECIALIDAD Y ESPECIALISTA
    this.horarios = await this.firestore.obtener("horarios");
    this.horarios = this.horarios.filter((element:any)=> {
      element.data.horariosCalculados = element.data.horariosCalculados.filter((element2:any)=>{
          return element2.especialidad === this.form.value.especialidad.data.nombre
      })
      return element.data.especialista.id === this.form.value.especialista.id
    })
    
    //VERIFICO SI NO HAY TURNOS EN ESE HORARIO
    if(this.horarios[0]?.data?.horariosCalculados){
      let aux :any[] = [];
      for (let diaTrabajo of this.horarios[0].data.horariosCalculados) {
        aux = aux.concat(this.obtenerProximosTurnosParaDia(diaTrabajo));
      }
      aux = aux.sort((a:any,b:any)=>{
        return a.fecha - b.fecha
      })
      this.horarios[0].data.horariosCalculados = aux;

      this.horarios[0].data.horariosCalculados = this.horarios[0]?.data?.horariosCalculados.filter((element:any)=> {
        element.horas = element.horas.filter((hora: any) => {
          return this.verificarDisponibilidadHorario(element.fecha,element.dia, hora);
        });
        return element;
      })
    }

  }

  obtenerProximosTurnosParaDia(diaTrabajo :any) {
    let proximosTurnos = [];
    let dia = new Date().getDay();
    
    for (let i = 0; i < 15; i++) {
      let diaDeLaSemana = this.diasDeLaSemana[dia];
      if (diaDeLaSemana === diaTrabajo.dia) {
        var hoy = new Date();
        var fecha = new Date();
        fecha.setDate(hoy.getDate()+i);
        diaTrabajo.fecha = fecha
        proximosTurnos.push({
          ...diaTrabajo
        });
      }
      
      // Avanzar al siguiente día
      dia = (dia + 1) % 7;
    }
    
    return proximosTurnos;
  }

  sonFechasIguales(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    );
  }

   verificarDisponibilidadHorario(fecha:any,dia:any,hora:any){
    let retorno = true;

    for (let i = 0; i< this.turnosCargados.length; i++) {
      for (let k = 0; k < this.turnosCargados[i].data.dia.length; k++) {
        //console.log(new Date(this.turnosCargados[i].data.dia[k].fecha))
        //console.log(fecha)
        if(this.turnosCargados[i].data.dia[k].descripcion === dia && this.sonFechasIguales(new Date(this.turnosCargados[i].data.dia[k].fecha),fecha) ){
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

  async cargarTurno(fecha:any,dia:any,hora:any){
    hora.disponible = false;

    let turnosCargados = await this.firestore.obtener("turnos");
    turnosCargados = turnosCargados.filter((element : any)=> element.data.especialista.id ===  this.form.value.especialista.id)

    if(turnosCargados.length){

      let fechaCargada : boolean = false;
      turnosCargados[0].data.dia.forEach((element:any) => {
        if(this.sonFechasIguales(new Date(element.fecha),fecha))
          fechaCargada = true;
      });

      
      if(!fechaCargada){
        turnosCargados[0].data.dia.push({descripcion:dia,hora: [hora],fecha:fecha.getTime()});
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
        dia: [{descripcion:dia,hora: [hora],fecha:fecha.getTime()}]
      }
      await this.firestore.guardar(data,"turnos");
    }
    await this.traerHorarios();
    Swal.fire("OK","Turno solicitado de manera correcta","success");
  }
}
