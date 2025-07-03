import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosFinalizadosMedico } from './turnos-finalizados-medico';

describe('TurnosFinalizadosMedico', () => {
  let component: TurnosFinalizadosMedico;
  let fixture: ComponentFixture<TurnosFinalizadosMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosFinalizadosMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosFinalizadosMedico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
