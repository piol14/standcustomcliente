import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject, debounceTime, switchMap, of } from 'rxjs';
import { IFavorito, IFavoritoPage, IStand, IUser } from 'src/app/model/model.interfaces';
import { FavoritoAjaxService } from 'src/app/service/favorito.ajax.service.service';
import { AdminFavoritoDetailUnroutedComponent } from '../admin-favorito-detail-unrouted/admin-favorito-detail-unrouted.component';

@Component({
    
    selector: 'app-admin-favorito-plist-unrouted',
    templateUrl: 'admin-favorito-plist-unrouted.component.html',
    styleUrls: ['admin-favorito-plist-unrouted.component.css']
})
export class AdminFavoritoPlistUnroutedComponent {
    @Input() forceReload: Subject<boolean> = new Subject<boolean>();
    oStand : IStand | null = null;
    oUsuario: IUser | null = null;
    oPage: IFavoritoPage | undefined;
    orderField: string = "id";
    orderDirection: string = "asc";
    oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
    status: HttpErrorResponse | null = null;
    oFavoritoToRemove: IFavorito | null = null;
    @Input() id_usuario: number = 0;
    @Input() id_stand: number = 0;
    constructor(
        private oFavoritoAjaxService: FavoritoAjaxService,
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

   /*  search(filterValue: string): void {
        if (filterValue && filterValue.length >= 3) {
            this.oFavoritoAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
                .pipe(
                    debounceTime(500),
                    switchMap((data: IFavoritoPage) => of(data))
                )
                .subscribe(
                    (data: IFavoritoPage) => {
                        this.oPage = data;
                    },
                    (error: any) => {
                        console.error(error);
                    }
                );
        } else {
            this.oFavoritoAjaxService.getPage(this.oPaginatorState.rows ?? 10, this.oPaginatorState.first, 'id', 'asc')
                .subscribe(
                    (data: IFavoritoPage) => {
                        this.oPage = data;
                    },
                    (error: any) => {
                        console.error(error);
                    }
                );
        }
    }
 */

    getValue(event: any): string {
        return event.target.value;
    }

    getPage(): void {
        this.oFavoritoAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_usuario, this.id_stand) .subscribe({
          next: (data: IFavoritoPage) => {
            this.oPage = data;
            this.oPaginatorState.pageCount = data.totalPages;
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

    doView(u: IFavorito) {
        this.ref = this.oDialogService.open(AdminFavoritoDetailUnroutedComponent, {
            data: {
                id: u.id
            },
            header: 'Vista Favorito ', 
            width: '50%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false
        });
    }

    doRemove(u: IFavorito) {
        this.oFavoritoToRemove = u;
        this.oCconfirmationService.confirm({
            accept: () => {
                this.oFavoritoAjaxService.removeOne(this.oFavoritoToRemove?.id).subscribe({
                    next: () => {
                        this.getPage();
                    },
                    error: (error: any) => {
                        console.error(error);
                     
                    }
                });
            },
            reject: (type: ConfirmEventType) => {
                
            }
        });
    }

}
