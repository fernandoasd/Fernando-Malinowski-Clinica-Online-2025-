import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosEspecialidad } from './turnos-especialidad';

describe('TurnosEspecialidad', () => {
  let component: TurnosEspecialidad;
  let fixture: ComponentFixture<TurnosEspecialidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosEspecialidad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosEspecialidad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
