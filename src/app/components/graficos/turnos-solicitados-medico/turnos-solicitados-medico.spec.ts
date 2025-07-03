import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosSolicitadosMedico } from './turnos-solicitados-medico';

describe('TurnosSolicitadosMedico', () => {
  let component: TurnosSolicitadosMedico;
  let fixture: ComponentFixture<TurnosSolicitadosMedico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosSolicitadosMedico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosSolicitadosMedico);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
