import { Component, Input, OnInit } from '@angular/core';
import { AdminCategoriaDetailUnroutedComponent } from '../admin-categoria-detail-unrouted/admin-categoria-detail-unrouted.component';
import { ICategoria, ICategoriaPage } from 'src/app/model/model.interfaces';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';
import { Subject, debounceTime, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-user-categoria-plist-unrouted',
  templateUrl: './user-categoria-plist-unrouted.component.html',
  styleUrls: ['./user-categoria-plist-unrouted.component.css']
})
export class UserCategoriaPlistUnroutedComponent implements OnInit {


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
  
   
  ) { }

  ngOnInit() {
    this.getCategorias();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getCategorias();
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

  getCategorias(): void {
    this.oCategoriaAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.first, 'id', 'asc').subscribe({
      next: (data: ICategoriaPage) => {
        this.oPage = data; // Almacena la página de categorías obtenida del servicio en la variable oPage
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
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
  

}



