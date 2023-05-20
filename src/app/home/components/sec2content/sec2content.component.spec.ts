import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sec2contentComponent } from './sec2content.component';

describe('Sec2contentComponent', () => {
  let component: Sec2contentComponent;
  let fixture: ComponentFixture<Sec2contentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Sec2contentComponent]
    });
    fixture = TestBed.createComponent(Sec2contentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
