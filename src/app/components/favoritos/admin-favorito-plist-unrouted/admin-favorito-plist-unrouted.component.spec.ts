
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminFavoritoPlistUnroutedComponent } from './admin-favorito-plist-unrouted.component';

describe('AdminFavoritoPlistUnroutedComponent', () => {
  let component: AdminFavoritoPlistUnroutedComponent;
  let fixture: ComponentFixture<AdminFavoritoPlistUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFavoritoPlistUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFavoritoPlistUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
