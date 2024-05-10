/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserUserPerfilUnroutedComponent } from './user-user-perfil-unrouted.component';

describe('UserUserPerfilUnroutedComponent', () => {
  let component: UserUserPerfilUnroutedComponent;
  let fixture: ComponentFixture<UserUserPerfilUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUserPerfilUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUserPerfilUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
