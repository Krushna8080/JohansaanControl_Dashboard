import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerHealthComponent } from './controller-health.component';

describe('ControllerHealthComponent', () => {
  let component: ControllerHealthComponent;
  let fixture: ComponentFixture<ControllerHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerHealthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
