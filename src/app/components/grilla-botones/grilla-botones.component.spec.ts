import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrillaBotonesComponent } from './grilla-botones.component';

describe('GrillaBotonesComponent', () => {
  let component: GrillaBotonesComponent;
  let fixture: ComponentFixture<GrillaBotonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrillaBotonesComponent]
    });
    fixture = TestBed.createComponent(GrillaBotonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
