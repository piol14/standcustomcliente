import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { IStand, IUser, IFavoritoPage, IFavorito, IStandPage } from 'src/app/model/model.interfaces';
import { FavoritoAjaxService } from 'src/app/service/favorito.ajax.service.service';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';

@Component({
  selector: 'app-user-favorito-plist-unrouted',
  templateUrl: './user-favorito-plist-unrouted.component.html',
  styleUrls: ['./user-favorito-plist-unrouted.component.css']
})
export class UserFavoritoPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
    oStand : IStand | null = null;
    oUsuario: IUser | null = null;
    page: IFavoritoPage | undefined;
    oPageStand: IStandPage |undefined;
    orderField: string = "id";
    orderDirection: string = "asc";
    paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
    status: HttpErrorResponse | null = null;
    oFavoritoToRemove: IFavorito | null = null;
    @Input() id_usuario: number = 0;
    @Input() id_stand: number = 0;
    constructor(
        private oFavoritoAjaxService: FavoritoAjaxService,
        private oStandAjaxService: StandAjaxService,
        public oDialogService: DialogService,
        private oMatSnackBar: MatSnackBar,
        public oDynamicDialogRef: DynamicDialogRef,
        private confirmationService: ConfirmationService,
        private router: Router 
       
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

  

  

  
 eliminarFavoritoRepetido(favoritoId: number): void {
    this.oFavoritoAjaxService.removeOne(favoritoId).subscribe({
      next: () => {
        this.oMatSnackBar.open('Stand eliminado de favoritos', 'Aceptar', { duration: 3000 });
       this.getPage();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar el stand de favoritos:', error);
        this.oMatSnackBar.open('Error al eliminar el stand de favoritos', 'Aceptar', { duration: 3000 });
      }

    });
    
  }
  getPage(): void {
    const rows: number = this.paginatorState.rows ?? 0;
    const page: number = this.paginatorState.page ?? 0;
    this.oFavoritoAjaxService.getFavoritoPageByUsuario(this.id_usuario, page, rows, this.orderField, this.orderDirection) .subscribe({
      next: (data: IFavoritoPage) => {
        this.page = data;
        this.paginatorState.pageCount = data.totalPages;
        console.log(data);
        console.log(this.paginatorState)
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
 
}
