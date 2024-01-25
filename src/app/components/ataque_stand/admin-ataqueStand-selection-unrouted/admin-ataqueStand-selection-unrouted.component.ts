
import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';

import { FormControl, FormGroup } from '@angular/forms';
import { IAtaqueStand, IAtaqueStandPage } from 'src/app/model/model.interfaces';
import { AtaqueStandAjaxService } from 'src/app/service/ataqueStand.ajax.service.service';
@Component({
  selector: 'app-admin-ataqueStand-selection-unrouted',
  templateUrl: './admin-ataqueStand-selection-unrouted.component.html',
  styleUrls: ['./admin-ataqueStand-selection-unrouted.component.css']
})
export class AdminAtaqueStandSelectionUnroutedComponent implements OnInit {

  @Input() id_user: number = 0; //filter by user

  oPage: IAtaqueStandPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
 

  formGroup: FormGroup;
  constructor(
    private oAtaqueStandAjaxService: AtaqueStandAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
    
    ) {    this.formGroup = new FormGroup({
      selectedThreads: new FormControl<any | null>(null)
    }); }

  ngOnInit() {
    this.getPage();
  }

 



  

  getPage(): void {
    this.oAtaqueStandAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_user).subscribe({
      next: (data: IAtaqueStandPage) => {
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

  onSelectThread(oThread: IAtaqueStand) {
    this.oDynamicDialogRef.close(oThread);
  }

}
