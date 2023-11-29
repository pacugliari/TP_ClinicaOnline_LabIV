import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartidoRoutingModule } from './compartido-routing.module';
import { FocusBorderDirective } from '../../directivas/focus-border.directive';


@NgModule({
  exports: [FocusBorderDirective],
  declarations: [
    FocusBorderDirective
  ],
  imports: [
    CommonModule,
    CompartidoRoutingModule
  ]
})
export class CompartidoModule { }
