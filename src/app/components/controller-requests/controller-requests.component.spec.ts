import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerRequestsComponent } from './controller-requests.component';

describe('ControllerRequestsComponent', () => {
  let component: ControllerRequestsComponent;
  let fixture: ComponentFixture<ControllerRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
