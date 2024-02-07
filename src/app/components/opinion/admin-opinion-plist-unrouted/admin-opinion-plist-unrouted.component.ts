// admin-Opinion-plist-unrouted.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';

import { IOpinion, IOpinionPage, IStand, IUser } from 'src/app/model/model.interfaces';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';

import { Subject, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AdminOpinionDetailUnroutedComponent } from '../admin-opinion-detail-unrouted/admin-opinion-detail-unrouted.component';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';


@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-opinion-plist-unrouted',
  templateUrl: './admin-opinion-plist-unrouted.component.html',
  styleUrls: ['./admin-opinion-plist-unrouted.component.css']
})
export class AdminOpinionPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  @Input() id_stand: number= 0;
  oPage: IOpinionPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oOpinionToRemove: IOpinion | null = null;
  oUsuario: IUser| null = null;
  oStand: IStand | null = null;
  constructor(
    private oStandAjaxService: StandAjaxService,
    private oUsuarioAjaxService: UserAjaxService,
    private oOpinionAjaxService: OpinionAjaxService,
    public oDialogService: DialogService,
    private oCconfirmationService: ConfirmationService,
   
  ) { }

  ngOnInit() {
    if (this.id_usuario > 0) {
      this.getUsuario();
      
    }
    if (this.id_stand > 0) {
      this.getStand();
    }
  
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getPage();
        }
      }
    });
  }

  // search(filterValue: string): void {
  //   if (filterValue && filterValue.length >= 3) {
  //     this.oOpinionAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
  //       .pipe(
  //         debounceTime(500),
  //         switchMap((data: IOpinionPage) => of(data))
  //       )
  //       .subscribe(
  //         (data: IOpinionPage) => {
  //           this.oPage = data;
  //         },
  //         (error: any) => {
  //           console.error(error);
  //         }
  //       );
  //   } else {
  //     this.oOpinionAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc')
  //       .subscribe(
  //         (data: IOpinionPage) => {
  //           this.oPage = data;
  //         },
  //         (error: any) => {
  //           console.error(error);
  //         }
  //       );
  //   }
  // }
  getUsuario(): void {
    this.oUsuarioAjaxService.getOne(this.id_usuario).subscribe({
      next: (data: IUser) => {
        this.oUsuario = data;

        console.log(this.oUsuario.id);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }
  getStand(): void {
    this.oStandAjaxService.getOne(this.id_stand).subscribe({
      next: (data: IStand) => {
        this.oStand = data;

        console.log(this.oStand.id);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })
  }
  getValue(event: any): string {
    return event.target.value;
  }

  getPage(): void {
    this.oOpinionAjaxService.getPage(
      this.oPaginatorState.rows, 
      this.oPaginatorState.page, 
      this.orderField, 
      this.orderDirection, 
      this.id_usuario, 
      this.id_stand
  ).subscribe({
      next: (data: IOpinionPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        this.orderField,
        this.orderDirection,

        this.id_usuario, 
        this.id_stand
        console.log(data);
        console.log(this.oPaginatorState)
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

  doView(u: IOpinion) {
    this.ref = this.oDialogService.open(AdminOpinionDetailUnroutedComponent, {
        data: {
            id: u.id
        },
        header: 'Vista Opinion', // Establece el encabezado directamente
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
    });
}

  doRemove(u: IOpinion) {
    this.oOpinionToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oOpinionAjaxService.removeOne(this.oOpinionToRemove?.id).subscribe({
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
