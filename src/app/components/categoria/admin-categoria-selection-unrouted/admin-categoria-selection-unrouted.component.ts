import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { ICategoriaPage, IStand,  ICategoria } from 'src/app/model/model.interfaces';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';

@Component({
  selector: 'app-admin-categoria-selection-unrouted',
  templateUrl: './admin-categoria-selection-unrouted.component.html',
  styleUrls: ['./admin-categoria-selection-unrouted.component.css']
})
export class AdminCategoriaSelectionUnroutedComponent implements OnInit {

  oStandToRemove: IStand | null = null;
  oPage: ICategoriaPage | undefined;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
 

  
  constructor(
    private oCategoriasAjaxService: CategoriaAjaxService,
    public oDialogService: DialogService,
    public oDynamicDialogRef: DynamicDialogRef,
  
    ) {}
  ngOnInit() {
    this.getPage();
  }

 



  

  getPage(): void {
    this.oCategoriasAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: ICategoriaPage) => {
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

  onSelectCategoria(oCategoria: ICategoria) {
    this.oDynamicDialogRef.close(oCategoria);
  }
}



