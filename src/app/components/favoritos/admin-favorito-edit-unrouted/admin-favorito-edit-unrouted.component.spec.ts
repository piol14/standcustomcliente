/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminFavoritoEditUnroutedComponent } from './admin-favorito-edit-unrouted.component';

describe('AdminFavoritoEditUnroutedComponent', () => {
  let component: AdminFavoritoEditUnroutedComponent;
  let fixture: ComponentFixture<AdminFavoritoEditUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFavoritoEditUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFavoritoEditUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
