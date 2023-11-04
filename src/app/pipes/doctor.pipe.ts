import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doctor'
})
export class DoctorPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return "Dr."+value;
  }

}
