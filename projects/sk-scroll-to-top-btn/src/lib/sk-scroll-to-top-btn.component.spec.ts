import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkScrollToTopBtnComponent } from './sk-scroll-to-top-btn.component';

describe('SkScrollToTopBtnComponent', () => {
  let component: SkScrollToTopBtnComponent;
  let fixture: ComponentFixture<SkScrollToTopBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkScrollToTopBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkScrollToTopBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
