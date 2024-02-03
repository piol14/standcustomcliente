import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IPartida, IPartidaPage } from 'src/app/model/model.interfaces';
import { PartidaAjaxService } from 'src/app/service/partida.ajax.service.service';

@Component({
  selector: 'app-admin-partida-selection-unrouted',
  templateUrl: './admin-partida-selection-unrouted.component.html',
  styleUrls: ['./admin-partida-selection-unrouted.component.css']
})
export class AdminPartidaSelectionUnroutedComponent implements OnInit {

  oPartidaToRemove: IPartida | null = null;
  oPage: IPartidaPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
 

  
  constructor(
    private oPartidaAjaxService: PartidaAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
  
    ) {}
  ngOnInit() {
    this.getPage();
  }

 



  

  getPage(): void {
    this.oPartidaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IPartidaPage) => {
        this.oPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        console.log(this.oPaginatorState);
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    })
  }




  onPageChang(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
  }

  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  onSelectPartida(oStand: IPartida) {
    this.oDynamicDialogRef.close(oStand);
  }

}
