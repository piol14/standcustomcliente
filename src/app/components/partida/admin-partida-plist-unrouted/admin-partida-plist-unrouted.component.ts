// admin-Partida-plist-unrouted.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api'; // Importa ConfirmationService de primeng/api
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';

import { IPartida, IPartidaPage } from 'src/app/model/model.interfaces';


import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { PartidaAjaxService } from 'src/app/service/partida.ajax.service.service';
import { AdminPartidaDetailUnroutedComponent } from '../admin-partida-detail-unrouted/admin-partida-detail-unrouted.component';



@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-partida-plist-unrouted',
  templateUrl: './admin-partida-plist-unrouted.component.html',
  styleUrls: ['./admin-partida-plist-unrouted.component.css']
})
export class AdminPartidaPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  oPage: IPartidaPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oPartidaToRemove: IPartida | null = null;


  constructor(
    private oPartidaAjaxService:PartidaAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService
   
  ) { }

  ngOnInit() {
    this.getPage();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }

  search(filterValue: string): void {
    if (filterValue && filterValue.length >= 3) {
      this.oPartidaAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
        .pipe(
          debounceTime(500),
          switchMap((data: IPartidaPage) => of(data))
        )
        .subscribe(
          (data: IPartidaPage) => {
            this.oPage = data;
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      this.oPartidaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc')
        .subscribe(
          (data: IPartidaPage) => {
            this.oPage = data;
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  getValue(event: any): string {
    return event.target.value;
  }

  getPage(): void {
    this.oPartidaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IPartidaPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    this.orderDirection = (this.orderDirection === "asc") ? "desc" : "asc";
    this.getPage();
  }

  ref: DynamicDialogRef | undefined;

  doView(u: IPartida) {
    this.ref = this.oDialogService.open(AdminPartidaDetailUnroutedComponent, {
        data: {
            id: u.id
        },
        header: 'Vista Partida', // Establece el encabezado directamente
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
    });
}

doRemove(u: IPartida) {
  this.oPartidaToRemove = u;
  this.oConfirmationService.confirm({
    message: 'Are you sure you want to remove this record?',
    accept: () => {
      this.oPartidaAjaxService.removeOne(this.oPartidaToRemove?.id).subscribe({
        next: () => {
          this.getPage();
        },
        error: (error: any) => {
          console.error(error);
          // Aquí puedes manejar el error de otra manera si es necesario
        }
      });
    },
    reject: (type: ConfirmEventType) => {
      // Manejar el rechazo si es necesario
    }
  });
}

// Resto del código sin cambios...

}

