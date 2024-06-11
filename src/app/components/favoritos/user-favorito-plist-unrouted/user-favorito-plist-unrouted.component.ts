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
import { SessionAjaxService } from './../../../service/session.ajax.service.service';

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
    usuario: IUser | null = null;
    constructor(
        private oFavoritoAjaxService: FavoritoAjaxService,
        private oStandAjaxService: StandAjaxService,
        public oDialogService: DialogService,
        private oMatSnackBar: MatSnackBar,
        public oDynamicDialogRef: DynamicDialogRef,
        private confirmationService: ConfirmationService,
        private router: Router ,
        private SessionAjaxService: SessionAjaxService,

       
    ) { }

    ngOnInit() {
      this.getPage();
      this.getStands(); // Aquí se corrige la llamada de getStands a getCategorias
      this.forceReload.subscribe({
        next: (v) => {
          if (v) {
            this.getPage();
            this.getStands(); // Aquí también se corrige de getStands a getCategorias
          }
        }
      });
    
      this.SessionAjaxService.getSessionUser()?.subscribe({
        next: (usuario: IUser) => {
          this.usuario = usuario;
          this.id_usuario = usuario.id;
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
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
 getStands(): void {
  const rows: number = this.paginatorState.rows ?? 0;
  const page: number = this.paginatorState.page ?? 0;
    this.oStandAjaxService.getStandPageByUsuario(this.id_usuario,page, rows, this.orderField, this.orderDirection).subscribe({
      next: (data: IStandPage) => {
        this.oPageStand = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
  borrarStand(id_stand: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este stand?',
      accept: () => {
        this.oStandAjaxService.removeOne(id_stand).subscribe({
          next: () => {
          
            this.getStands();
            this.oMatSnackBar.open('El stand ha sido eliminado exitosamente', '', { duration: 2000 });
          },
          error: () => {
            this.oMatSnackBar.open('Error al eliminar el elemento', '', { duration: 2000 });
          }
        });
      }
    });
  }
  isUsuarioStand(stand: IStand): boolean {
    return this.usuario !== null && stand.usuario.id === this.usuario.id;
  }
  isAdministrador(): boolean {
    return this.usuario !== null && this.usuario.role === false;
  }

}
