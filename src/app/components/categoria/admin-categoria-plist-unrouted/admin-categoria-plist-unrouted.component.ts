import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject, debounceTime, of, switchMap } from 'rxjs';
import { ICategoria, ICategoriaPage } from 'src/app/model/model.interfaces';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';
import { AdminCategoriaDetailUnroutedComponent } from '../admin-categoria-detail-unrouted/admin-categoria-detail-unrouted.component';


@Component({
  selector: 'app-admin-categoria-plist-unrouted',
  templateUrl: './admin-categoria-plist-unrouted.component.html',
  styleUrls: ['./admin-categoria-plist-unrouted.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminCategoriaPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  oPage: ICategoriaPage | undefined ;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oCategoriaToRemove: ICategoria | null = null;

  constructor(
    private oCategoriaAjaxService: CategoriaAjaxService,
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
      this.oCategoriaAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
        .pipe(
          debounceTime(500),
          switchMap((data: ICategoriaPage) => of(data))
        )
        .subscribe(
          (data: ICategoriaPage) => {
            this.oPage = data;
          },
          (error: any) => {
            console.error(error);
          }
        );
    } else {
      this.oCategoriaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc')
        .subscribe(
          (data: ICategoriaPage) => {
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
    this.oCategoriaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection).subscribe({
      next: (data: ICategoriaPage) => {
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

  doView(u: ICategoria) {
    this.ref = this.oDialogService.open(AdminCategoriaDetailUnroutedComponent, {
        data: {
            id: u.id
        },
        header: 'Vista Categoria ' , // Establece el encabezado directamente
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
    });
}
  doRemove(u: ICategoria) {
    this.oCategoriaToRemove = u;
    this.oCconfirmationService.confirm({
      accept: () => {
        this.oCategoriaAjaxService.removeOne(this.oCategoriaToRemove?.id).subscribe({
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
