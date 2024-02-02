import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';

import { IAtaqueStand, IAtaqueStandPage } from 'src/app/model/model.interfaces';

import { Subject, of } from 'rxjs';



import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { IDetallePartida, IDetallePartidaPage } from 'src/app/model/model.interfaces';
import { AdminDetallePartidaDetailUnroutedComponent } from '../admin-detallePartida-detail-unrouted/admin-detallePartida-detail-unrouted.component';
@Component({
  selector: 'app-admin-detallePartida-plist-unrouted',
  templateUrl: './admin-detallePartida-plist-unrouted.component.html',
  styleUrls: ['./admin-detallePartida-plist-unrouted.component.css']
})
export class AdminDetallePartidaPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  oPage: IDetallePartidaPage | undefined ;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oDetallePartidaToRemove: IDetallePartida | null = null;

  constructor(
    private oDetallePartidaAjaxService: DetallePartidaAjaxService,
    public oDialogService: DialogService,
    private oCconfirmationService: ConfirmationService,
   
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
      this.oDetallePartidaAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
        .pipe(
          debounceTime(500),
          switchMap((data: IDetallePartidaPage) => of(data))
        )
        .subscribe(
          (data: IDetallePartidaPage) => {
            this.oPage = data;
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      this.oDetallePartidaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc')
        .subscribe(
          (data: IDetallePartidaPage) => {
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
    this.oDetallePartidaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IDetallePartidaPage) => {
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

  doView(u: IDetallePartida) {
    this.ref = this.oDialogService.open(AdminDetallePartidaDetailUnroutedComponent, {
        data: {
            id: u.id
        },
        header: 'Vista Detalle Partida ' , // Establece el encabezado directamente
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
    });
}
  doRemove(u: IDetallePartida) {
    this.oDetallePartidaToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oDetallePartidaAjaxService.removeOne(this.oDetallePartidaToRemove?.id).subscribe({
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

}
