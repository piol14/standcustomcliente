
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminFavoritoFormUnroutedComponent } from './admin-favorito-form-unrouted.component';

describe('AdminFavoritoFormUnroutedComponent', () => {
  let component: AdminFavoritoFormUnroutedComponent;
  let fixture: ComponentFixture<AdminFavoritoFormUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFavoritoFormUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFavoritoFormUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
