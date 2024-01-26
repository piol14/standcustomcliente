import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatorState } from 'primeng/paginator';
import { IUser, IUserPage } from 'src/app/model/model.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-admin-usuario-selection-unrouted',
  templateUrl: './admin-usuario-selection-unrouted.component.html',
  styleUrls: ['./admin-usuario-selection-unrouted.component.css']
})
export class AdminUsuarioSelectionUnroutedComponent implements OnInit {
  oUserToRemove: IUser | null = null;
  oPage: IUserPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
 

  formGroup: FormGroup;
  constructor(
    private oUserAjaxService: UserAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
    
    ) {    this.formGroup = new FormGroup({
      selectedThreads: new FormControl<any | null>(null)
    }); }

  ngOnInit() {
    this.getPage();
  }

 



  

  getPage(): void {
    this.oUserAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: IUserPage) => {
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

  onSelectUser(oUser: IUser) {
    this.oDynamicDialogRef.close(oUser);
  }

}