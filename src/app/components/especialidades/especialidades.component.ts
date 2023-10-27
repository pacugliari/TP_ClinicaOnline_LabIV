import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent {

  tableDetalle : string[] = ['especialidad','check'];
  lista : MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatTable)
  table!: MatTable<any>;
  isChecked : boolean = false;
  cargando : boolean = false;
  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  
  form = this.formBuilder.group({
    especialidad: ['',[Validators.required]],
  });

  async ngOnInit(){
    this.lista.paginator = this.paginator
    await this.actualizar();
    if(this.data.lista.length){
      this.data.lista.forEach((i:any) => {
        this.lista.data.forEach(j => {
          if(j.data.nombre === i.nombre)
            j.data.estaMarcado = true;
        });
      });

    }
  }

  constructor(private formBuilder:FormBuilder,private firestore:FirestoreService,public dialogRef: MatDialogRef<EspecialidadesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any){
  }

  async actualizar(){
    this.cargando = true;
    await this.firestore.obtener("especialidades").then((resultado:any)=>{
      this.lista.data = resultado;
    })
    this.cargando = false;
  }

  traerSeleccionados(){
    let seleccionados : any[] = [];
    this.lista.data.forEach((element) => {
      if(element.data.estaMarcado){
        seleccionados.push(element.data);
      }
    });
    return seleccionados;
  }

  ngOnDestroy() {
    this.dialogRef.close(this.traerSeleccionados())
  }

  async agregarEspecialidad(){
    this.cargando = true;
    if(this.form.valid){
      await this.firestore.guardar({nombre:this.form.value.especialidad,estaMarcado:false},"especialidades");
      await this.actualizar();
    }else{
      Swal.fire("ERROR","Ingrese los campos requeridos","error");
    }
    this.cargando = false;
    this.form.reset();
  }

}
