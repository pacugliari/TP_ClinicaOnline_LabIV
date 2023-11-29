import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormBuilder } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Registra el idioma español para Angular
registerLocaleData(localeEs);

// Importa e instala el adaptador de fecha
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements AfterViewInit {
  
  @ViewChild('scatterChart') scatterChart!: ElementRef;
  @ViewChild('pieChart') pieChart!: ElementRef;
  @ViewChild('barChart') barChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('lineChart2') lineChart2!: ElementRef;
  @ViewChild('card') card!: ElementRef;

  ingresosData :any[]= [];
  scatterChartInstance: any;
  logs : any[] = [];
  turnos : any[] = [];
  conteoEspecialidades :any= {};
  conteoTurnosPorDia :any= {};
  coloresPorUsuario: { [usuario: string]: string } = {};
  conteoTurnosSolicitadoPorMedicoEnUnLapso:any= {};
  conteoTurnosFinalizadoPorMedicoEnUnLapso:any= {};
  lineChartInstance:any;
  lineChartInstance2:any;

  form = this.formBuilder.group({
    fechaInicio: [null,[]],
    fechaFin: [null,[]],
  });

  form2 = this.formBuilder.group({
    fechaInicio: [null,[]],
    fechaFin: [null,[]],
  });

  constructor(private firestore:FirestoreService,private formBuilder:FormBuilder){

  }

  async ngAfterViewInit() {
    this.logs = await this.firestore.obtener("logs");
    this.turnos = await this.firestore.obtener("turnos");
    //console.log(this.turnos)

    this.logs = this.logs.sort((a: any, b: any) => {
      return Number(b.data.dia)-Number(a.data.dia)
    })
    this.formatearLogs();
    this.formatearTurnosPorEspecialidad()
    this.formatearTurnosPorDia();
    this.formatearTurnosSolicitadosPorMedicoEnLapso();
    this.formatearTurnosFinalizadosPorMedicoEnLapso()
    this.createScatterChart();
    this.graficoTurnosPorEspecialidad();
    this.graficoTurnosPorDia();
    this.graficoTurnosSolicitadoPorMedicoEnLapso();
    this.graficoTurnosFinalizadoPorMedicoEnLapso();
  }

  recalcular(){
    // Recorrer el vector de turnos
    let fechaFin :any = this.form.value.fechaFin;
    let fechaInicio :any= this.form.value.fechaInicio
    this.conteoTurnosSolicitadoPorMedicoEnUnLapso={}
    this.formatearTurnosSolicitadosPorMedicoEnLapso();
    if( fechaFin !== null &&  fechaInicio !== null && fechaFin !== undefined && fechaInicio !== undefined){

      let aux :any= []
      //console.log(this.conteoTurnosSolicitadoPorMedicoEnUnLapso)
      Object.entries(this.conteoTurnosSolicitadoPorMedicoEnUnLapso).forEach(([fecha, datos]: any) => {
        const fechaForma = new Date(Number(fecha));
        const dia = fechaForma.getDate();
        const mes = fechaForma.getMonth() + 1;
        const año = fechaForma.getFullYear();
        const fechaFormateada = `${año}-${mes}-${dia < 10 ? Number(0).toString()+dia.toString() : dia}`;


        if(fechaFormateada >= fechaInicio && fechaFormateada <= fechaFin){
          aux[fecha]=datos
        }
  
      });
      
      this.conteoTurnosSolicitadoPorMedicoEnUnLapso = aux; 
      this.graficoTurnosSolicitadoPorMedicoEnLapso()
    }
  }

  recalcular2(){
    // Recorrer el vector de turnos
    let fechaFin :any = this.form2.value.fechaFin;
    let fechaInicio :any= this.form2.value.fechaInicio
    this.conteoTurnosSolicitadoPorMedicoEnUnLapso={}
    this.formatearTurnosFinalizadosPorMedicoEnLapso();
    if( fechaFin !== null &&  fechaInicio !== null && fechaFin !== undefined && fechaInicio !== undefined){

      let aux :any= []
      //console.log(this.conteoTurnosSolicitadoPorMedicoEnUnLapso)
      Object.entries(this.conteoTurnosFinalizadoPorMedicoEnUnLapso).forEach(([fecha, datos]: any) => {
        const fechaForma = new Date(Number(fecha));
        const dia = fechaForma.getDate();
        const mes = fechaForma.getMonth() + 1;
        const año = fechaForma.getFullYear();
        const fechaFormateada = `${año}-${mes}-${dia < 10 ? Number(0).toString()+dia.toString() : dia}`;


        if(fechaFormateada >= fechaInicio && fechaFormateada <= fechaFin){
          aux[fecha]=datos
        }
  
      });
      
      this.conteoTurnosFinalizadoPorMedicoEnUnLapso = aux; 
      this.graficoTurnosFinalizadoPorMedicoEnLapso()
    }
  }


  formatearTurnosFinalizadosPorMedicoEnLapso(){
    // Recorrer el vector de turnos
    this.conteoTurnosFinalizadoPorMedicoEnUnLapso= {}
    this.turnos.forEach(turno => {
      const dia = turno.data.dia
      const especialista = turno.data.especialista.data.datos.apellido
      dia.forEach((dia:any) => {//[0].data.dia[0].hora[0].estado
        dia.hora.forEach((hora:any) => {
          if(hora.estado === "Realizado"){
            if (this.conteoTurnosFinalizadoPorMedicoEnUnLapso[dia.fecha] && especialista === this.conteoTurnosFinalizadoPorMedicoEnUnLapso[dia.fecha].especialista) {
              // Incrementar el contador si la especialidad ya existe
              this.conteoTurnosFinalizadoPorMedicoEnUnLapso[dia.fecha].cantidad++;
            } else {
              // Inicializar el contador a 1 si la especialidad no existe
              this.conteoTurnosFinalizadoPorMedicoEnUnLapso[dia.fecha]={cantidad: 1 ,especialista: especialista,fecha: dia.fecha};
            }
          }
        });
      });
    });

    const arrayDePares = Object.entries(this.conteoTurnosFinalizadoPorMedicoEnUnLapso);

    // Ordenar el array por fecha
    arrayDePares.sort(([a], [b]) => {
      return Number(a)- Number(b)
    });

    this.conteoTurnosFinalizadoPorMedicoEnUnLapso = Object.fromEntries(arrayDePares);
  }

  formatearTurnosSolicitadosPorMedicoEnLapso(){
    this.conteoTurnosSolicitadoPorMedicoEnUnLapso = {}
    this.turnos.forEach(turno => {
      const dia = turno.data.dia
      const especialista = turno.data.especialista.data.datos.apellido
      dia.forEach((dia:any) => {
        dia.hora.forEach((hora:any) => {
          //if(hora.estado !== "Realizado"){
            // Verificar si la especialidad ya está en el objeto de conteo
            if (this.conteoTurnosSolicitadoPorMedicoEnUnLapso[dia.fecha] && especialista === this.conteoTurnosSolicitadoPorMedicoEnUnLapso[dia.fecha].especialista) {
              // Incrementar el contador si la especialidad ya existe
              this.conteoTurnosSolicitadoPorMedicoEnUnLapso[dia.fecha].cantidad++;
            } else {
              // Inicializar el contador a 1 si la especialidad no existe
              this.conteoTurnosSolicitadoPorMedicoEnUnLapso[dia.fecha]={cantidad: 1 ,especialista: especialista,fecha: dia.fecha};
            }
         // }
        });
      });
    });

    const arrayDePares = Object.entries(this.conteoTurnosSolicitadoPorMedicoEnUnLapso);

    // Ordenar el array por fecha
    arrayDePares.sort(([a], [b]) => {
      return Number(a)- Number(b)
    });

    this.conteoTurnosSolicitadoPorMedicoEnUnLapso = Object.fromEntries(arrayDePares);
    


  }

  formatearTurnosPorEspecialidad(){
    
  // Recorrer el vector de turnos
  this.turnos.forEach(turno => {
    const dia = turno.data.dia
    dia.forEach((dia:any) => {
      dia.hora.forEach((hora:any) => {
        // Verificar si la especialidad ya está en el objeto de conteo
        if (this.conteoTurnosPorDia[dia.descripcion]) {
          // Incrementar el contador si la especialidad ya existe
          this.conteoTurnosPorDia[dia.descripcion]++;
        } else {
          // Inicializar el contador a 1 si la especialidad no existe
          this.conteoTurnosPorDia[dia.descripcion] = 1;
        }
      });
    });
  });
    //console.log(this.conteoTurnosPorDia)
  }

  formatearTurnosPorDia(){
      // Recorrer el vector de turnos
    this.turnos.forEach(turno => {
      const dia = turno.data.dia
      dia.forEach((dia:any) => {
        const especialidad = dia.especialidad.data.nombre;
        dia.hora.forEach((hora:any) => {
          // Verificar si la especialidad ya está en el objeto de conteo
          if (this.conteoEspecialidades[especialidad]) {
            // Incrementar el contador si la especialidad ya existe
            this.conteoEspecialidades[especialidad]++;
          } else {
            // Inicializar el contador a 1 si la especialidad no existe
            this.conteoEspecialidades[especialidad] = 1;
          }
        });
      });
    });
      //console.log(this.conteoEspecialidades)
  }

  formatearLogs(){
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    this.logs.forEach((log:any) => {
      const fecha = new Date(log.data.dia);
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const año = fecha.getFullYear();
      const fechaFormateada = `${dia}-${mes}-${año}`;
      const horas = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');
      const horario = `${horas}hs`;//:${minutos}
      const horarioDetalle = `${horas}:${minutos}`;//

      // Verificar si ya se ha asignado un color al usuario
      const usuario = log.data.usuario.data.datos.apellido;
      const color = this.coloresPorUsuario[usuario] || this.getColorBasedOnTime();


      let formateado = {
        usuario: log.data.usuario.data.datos.apellido,
        dia: fechaFormateada.toString(),//+diasSemana[fecha.getDay()].toString()
        horario: horario,
        horarioDetalle:horarioDetalle,
        color : color
      }

      this.coloresPorUsuario[usuario] = color;
      this.ingresosData.push(formateado);
    });
  }

  createScatterChart() {
    const ctx = this.scatterChart.nativeElement.getContext('2d', { willReadFrequently: true });
  
    const diasUnicos = Array.from(new Set(this.ingresosData.map(entry => entry.dia))).sort();;
    const horasUnicas = Array.from(new Set(this.ingresosData.map(entry => entry.horario))).sort().reverse();
    
    // Agrupar datos por usuario
    const dataPorUsuario :any = {};
    this.ingresosData.forEach(entry => {
      if (!dataPorUsuario[entry.usuario]) {
        dataPorUsuario[entry.usuario] = [];
      }
      dataPorUsuario[entry.usuario].push({ x: entry.dia, y: entry.horario, backgroundColor: entry.color });
    });
  
    this.scatterChartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        labels: diasUnicos,  // Etiquetas para el eje X (días)
        datasets: Object.keys(dataPorUsuario).map(usuario => ({
          label: usuario,
          data: dataPorUsuario[usuario],
          pointRadius: 8,
          backgroundColor: dataPorUsuario[usuario][0].backgroundColor
        })),
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',  // Usar escala de categoría para los días
            position: 'bottom',
          },
          y: {
            type: 'category',  // Usar escala de categoría para las horas
            position: 'left',
            labels: horasUnicas,
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  graficoTurnosPorEspecialidad(){
    const ctx = this.pieChart.nativeElement.getContext('2d', { willReadFrequently: true });
    const especialidades :any[]= [];
    const cantidadDeTurnosPorEspecialidad :any[]= [];

    Object.entries(this.conteoEspecialidades).forEach(([especialidad, cantidad]) => {
      especialidades.push(especialidad);
      cantidadDeTurnosPorEspecialidad.push(cantidad);
    });

    const colores : any = this.generarColoresAleatorios(cantidadDeTurnosPorEspecialidad.length)
    const pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: especialidades,
        datasets: [{
          data: cantidadDeTurnosPorEspecialidad,
          backgroundColor: colores,
          borderColor: colores,
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
      },
    });
  }

  graficoTurnosPorDia(){
    const ctx = this.barChart.nativeElement.getContext('2d', { willReadFrequently: true });

    const dias :any[]= [];
    const cantidadTurnosPorDia :any[]= [];

      // Orden específico que deseas
      const ordenDiasEspecifico = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

      // Obtener un array de las claves (días de la semana) ordenadas según el orden específico
      const diasOrdenados = Object.keys(this.conteoTurnosPorDia).sort((a, b) => {
        return ordenDiasEspecifico.indexOf(a) - ordenDiasEspecifico.indexOf(b);
      });

      // Iterar sobre los días ordenados y agregar a los arrays
      diasOrdenados.forEach(dia => {
        dias.push(dia);
        cantidadTurnosPorDia.push(this.conteoTurnosPorDia[dia]);
      });
    const colores : any = this.generarColoresAleatorios(cantidadTurnosPorDia.length)

    const barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dias,
        datasets: [{
          label: 'Cantidad de Turnos',
          data: cantidadTurnosPorDia,
          backgroundColor: colores,
          borderColor: colores,
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
          },
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  graficoTurnosSolicitadoPorMedicoEnLapso(){
    // Verificar si ya existe una instancia del gráfico
    if (!this.lineChartInstance) {
      const ctx = this.lineChart.nativeElement.getContext('2d', { willReadFrequently: true });

      this.lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [], // Inicialmente vacío
          datasets: [],
        },
        options: {
          responsive: true,
          spanGaps: true,
          scales: {
            x: {
              type: 'category',
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    const conteoTurnosPorMedicoEnElTiempo: any = {};
    const tiempos: any[] = [];
    
    let indice = 0;

    
    Object.entries(this.conteoTurnosSolicitadoPorMedicoEnUnLapso).forEach(([fecha, datos]: any) => {
      const fechaForma = new Date(Number(fecha));
      const dia = fechaForma.getDate();
      const mes = fechaForma.getMonth() + 1;
      const año = fechaForma.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`;

      tiempos[indice]=fechaFormateada

      if (!conteoTurnosPorMedicoEnElTiempo[datos.especialista]) {
        conteoTurnosPorMedicoEnElTiempo[datos.especialista] = [];
      }

      conteoTurnosPorMedicoEnElTiempo[datos.especialista][indice]=datos.cantidad;
      indice++;
    });

    //console.log(tiempos)
    //console.log(conteoTurnosPorMedicoEnElTiempo)

    const medicos = Object.keys(conteoTurnosPorMedicoEnElTiempo);
    const datosPorMedico = Object.values(conteoTurnosPorMedicoEnElTiempo);

    this.lineChartInstance.data.labels = tiempos
    // Actualizar datos directamente en la instancia del gráfico
    this.lineChartInstance.data.datasets = medicos.map((medico, index) => ({
      label: medico,
      data: datosPorMedico[index],
      fill: false,
      borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 1)`,
    }));



    // Llamar al método update() para aplicar los cambios y actualizar el gráfico
    this.lineChartInstance.update();
  }

  graficoTurnosFinalizadoPorMedicoEnLapso(){
    // Verificar si ya existe una instancia del gráfico
    if (!this.lineChartInstance2) {
      const ctx = this.lineChart2.nativeElement.getContext('2d', { willReadFrequently: true });

      this.lineChartInstance2 = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [], // Inicialmente vacío
          datasets: [],
        },
        options: {
          responsive: true,
          spanGaps: true,
          scales: {
            x: {
              type: 'category',
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    const conteoTurnosPorMedicoEnElTiempo: any = {};
    const tiempos: any[] = [];
    
    let indice = 0;

    
    Object.entries(this.conteoTurnosFinalizadoPorMedicoEnUnLapso).forEach(([fecha, datos]: any) => {
      const fechaForma = new Date(Number(fecha));
      const dia = fechaForma.getDate();
      const mes = fechaForma.getMonth() + 1;
      const año = fechaForma.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`;

      tiempos[indice]=fechaFormateada

      if (!conteoTurnosPorMedicoEnElTiempo[datos.especialista]) {
        conteoTurnosPorMedicoEnElTiempo[datos.especialista] = [];
      }

      conteoTurnosPorMedicoEnElTiempo[datos.especialista][indice]=datos.cantidad;
      indice++;
    });

    //console.log(tiempos)
    //console.log(conteoTurnosPorMedicoEnElTiempo)

    const medicos = Object.keys(conteoTurnosPorMedicoEnElTiempo);
    const datosPorMedico = Object.values(conteoTurnosPorMedicoEnElTiempo);

    this.lineChartInstance2.data.labels = tiempos
    // Actualizar datos directamente en la instancia del gráfico
    this.lineChartInstance2.data.datasets = medicos.map((medico, index) => ({
      label: medico,
      data: datosPorMedico[index],
      fill: false,
      borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}, 1)`,
    }));



    // Llamar al método update() para aplicar los cambios y actualizar el gráfico
    this.lineChartInstance2.update();
  }

  getColorBasedOnTime(): string {
    // Generar un color hexadecimal basado en el tiempo actual
    const time = new Date().getTime();
    const variation = Math.floor(Math.random() * 1000); // Valor adicional para variar los colores
    const color = `#${((time + variation) & 0xFFFFFF).toString(16).toUpperCase()}`;

    return color;
  }

  generarColoresAleatorios(cantidad:any) {
    const colores = [];
  
    for (let i = 0; i < cantidad; i++) {
      const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      colores.push(color);
    }
  
    return colores;
  }


  
  htmltoPDF()
  {
    const chartContainer = this.card.nativeElement;

    html2canvas(chartContainer).then((canvas) => {
      // Crear un objeto jspdf
      const pdfFile = new jspdf('p', 'pt', 'a4');
  
      // Calcular la relación de aspecto para ajustar el tamaño del canvas en el PDF
      const aspectRatio = canvas.width / canvas.height;
      const pdfWidth = pdfFile.internal.pageSize.getWidth();
      const pdfHeight = pdfWidth / aspectRatio;
  
      // Agregar la imagen al PDF y ajustar el tamaño
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdfFile.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  
      // Guardar el PDF
      pdfFile.save('Estadisticas.pdf');
    });
  
  }

  
}
