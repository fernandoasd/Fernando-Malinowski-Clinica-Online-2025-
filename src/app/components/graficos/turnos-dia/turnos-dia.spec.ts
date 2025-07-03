import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnosDia } from './turnos-dia';

describe('TurnosDia', () => {
  let component: TurnosDia;
  let fixture: ComponentFixture<TurnosDia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosDia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
