import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';


import { Subject, of } from 'rxjs';



import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { IDetallePartida, IDetallePartidaPage, IPartida, IStand, IUser } from 'src/app/model/model.interfaces';
import { AdminDetallePartidaDetailUnroutedComponent } from '../admin-detallePartida-detail-unrouted/admin-detallePartida-detail-unrouted.component';
@Component({
  selector: 'app-admin-detallePartida-plist-unrouted',
  templateUrl: './admin-detallePartida-plist-unrouted.component.html',
  styleUrls: ['./admin-detallePartida-plist-unrouted.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminDetallePartidaPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  @Input() id_stand: number = 0;
  @Input() id_partida: number = 0;
  oPage: IDetallePartidaPage | undefined ;
  oUsuario:IUser | null = null;
  oStand: IStand | null = null;
  oPartida: IPartida | null = null; 
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
      this.oDetallePartidaAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc',this.id_usuario,this.id_stand,this.id_partida)
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
      this.oDetallePartidaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc', this.id_usuario,this.id_stand,this.id_partida)
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
    this.oDetallePartidaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_usuario,this.id_stand,this.id_partida).subscribe({
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
