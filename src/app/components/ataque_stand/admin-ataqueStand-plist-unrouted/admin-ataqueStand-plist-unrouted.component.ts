// admin-AtaquIAtaqueStand-plist-unrouted.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';

import { IAtaqueStand, IAtaqueStandPage } from 'src/app/model/model.interfaces';

import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AtaqueStandAjaxService } from 'src/app/service/ataqueStand.ajax.service.service';
import { AdminAtaqueStandDetailUnroutedComponent } from '../admin-ataque_stand-detail-unrouted/admin-ataque_stand-detail-unrouted.component';


@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-ataqueStand-plist-unrouted',
  templateUrl: './admin-ataqueStand-plist-unrouted.component.html',
  styleUrls: ['./admin-ataqueStand-plist-unrouted.component.css']
})
export class AdminAtaqueStandPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  oPage: IAtaqueStandPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oAtaqueStandToRemove: IAtaqueStand | null = null;

  constructor(
    private oStandAjaxService: AtaqueStandAjaxService,
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
      this.oStandAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
        .pipe(
          debounceTime(500),
          switchMap((data: IAtaqueStandPage) => of(data))
        )
        .subscribe(
          (data: IAtaqueStandPage) => {
            this.oPage = data;
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      this.oStandAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc')
        .subscribe(
          (data: IAtaqueStandPage) => {
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
    this.oStandAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IAtaqueStandPage) => {
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

  doView(u: IAtaqueStand) {
    this.ref = this.oDialogService.open(AdminAtaqueStandDetailUnroutedComponent, {
        data: {
            id: u.id
        },
        header: 'Vista Ataque Stand', // Establece el encabezado directamente
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
    });
}
 
  doRemove(u: IAtaqueStand) {
    this.oAtaqueStandToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oStandAjaxService.removeOne(this.oAtaqueStandToRemove?.id).subscribe({
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

