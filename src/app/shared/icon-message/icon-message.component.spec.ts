import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconMessageComponent } from './icon-message.component';

describe('IconMessageComponent', () => {
  let component: IconMessageComponent;
  let fixture: ComponentFixture<IconMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
