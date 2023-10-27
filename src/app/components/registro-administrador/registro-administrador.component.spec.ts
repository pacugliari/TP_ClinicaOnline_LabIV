import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAdministradorComponent } from './registro-administrador.component';

describe('RegistroAdministradorComponent', () => {
  let component: RegistroAdministradorComponent;
  let fixture: ComponentFixture<RegistroAdministradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroAdministradorComponent]
    });
    fixture = TestBed.createComponent(RegistroAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
