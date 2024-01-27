import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IStand, IStandPage } from 'src/app/model/model.interfaces';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';

@Component({
  selector: 'app-admin-stand-selection-unrouted',
  templateUrl: './admin-stand-selection-unrouted.component.html',
  styleUrls: ['./admin-stand-selection-unrouted.component.css']
})
export class AdminStandSelectionUnroutedComponent implements OnInit {

  oUserToRemove: IStand | null = null;
  oPage: IStandPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
 

  
  constructor(
    private oStandAjaxService: StandAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
  
    ) {}
  ngOnInit() {
    this.getPage();
  }

 



  

  getPage(): void {
    this.oStandAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IStandPage) => {
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

  onSelectStand(oStand: IStand) {
    this.oDynamicDialogRef.close(oStand);
  }
}
