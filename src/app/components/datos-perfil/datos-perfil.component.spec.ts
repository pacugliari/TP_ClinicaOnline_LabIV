import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosPerfilComponent } from './datos-perfil.component';

describe('DatosPerfilComponent', () => {
  let component: DatosPerfilComponent;
  let fixture: ComponentFixture<DatosPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatosPerfilComponent]
    });
    fixture = TestBed.createComponent(DatosPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
