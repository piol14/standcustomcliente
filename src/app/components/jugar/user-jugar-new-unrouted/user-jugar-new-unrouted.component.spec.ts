
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserJugarNewUnroutedComponent } from './user-jugar-new-unrouted.component';

describe('UserJugarNewUnroutedComponent', () => {
  let component: UserJugarNewUnroutedComponent;
  let fixture: ComponentFixture<UserJugarNewUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserJugarNewUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserJugarNewUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
