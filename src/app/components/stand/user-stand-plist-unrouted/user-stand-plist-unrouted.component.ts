import { SessionAjaxService } from './../../../service/session.ajax.service.service';
import { ICategoria, ICategoriaPage, IFavorito, IStand, IUser } from './../../../model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorState } from 'primeng/paginator';
import { IStandPage } from 'src/app/model/model.interfaces';
import { AdminStandDetailUnroutedComponent } from '../admin-stand-detail-unrouted/admin-stand-detail-unrouted.component';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';
import { UserStandDetailUnroutedComponent } from '../user-stand-detail-unrouted/user-stand-detail-unrouted.component';
import { UserStandFormUnroutedComponent } from '../user-stand-form-unrouted/user-stand-form-unrouted.component';
import {  MessageService } from 'primeng/api';

import { ConfirmEventType } from 'primeng/api';
import { FavoritoAjaxService } from 'src/app/service/favorito.ajax.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-stand-plist-unrouted',
  templateUrl: './user-stand-plist-unrouted.component.html',
  styleUrls: ['./user-stand-plist-unrouted.component.css'],
  providers: [  ConfirmationService]
})
export class UserStandPlistUnroutedComponent implements OnInit {
  favoritos: { [key: number]: boolean } = {};


  @Input() id: number = 0;
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  @Input() id_categoria: number = 9;
  @Input() id_stand: number = 0;
  categoria: ICategoria[] = [];
  stand: IStand[] = [];
  oPage: ICategoriaPage | undefined;
  favorito: boolean = false;
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 12, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oCategoriaToRemove: ICategoria | null = null;
  value: string = '';
  oStandPage: IStandPage | undefined;
 
  standsPorPagina: number = 8;

  strUserName: string = "";
 
  oStandToRemove: IStand | null = null;
  usuario: IUser | null = null;
  oCategoria: ICategoria | null = null;
  idCategoriaFiltrada: number | null = null;
  filtrandoPorCategoria: boolean = false;


  constructor(
    private SessionAjaxService: SessionAjaxService,
    private oCategoriaAjaxService: CategoriaAjaxService,
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
  filtrarPorCategoria(idCategoria: number): void {
    console.log(idCategoria);
    this.id_categoria = idCategoria;
    this.getPage(); 
    console.log(this.id_categoria);

    this.idCategoriaFiltrada = idCategoria;
    this.filtrandoPorCategoria = true;
    console.log(idCategoria);
  }
  isUsuarioStand(stand: IStand): boolean {
    return this.usuario !== null && stand.usuario.id === this.usuario.id;
   
  }
  esFavorito(stand: IStand): boolean {
    return stand.id in this.favoritos && this.favoritos[stand.id];
  }
  
  private actualizarFavoritosDesdeLocalStorage(): void {
    // Recorrer todas las claves del almacenamiento local
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('favorito_')) {
        // Obtener el id del stand desde la clave
        const id_stand = Number(key.split('_')[6]);
        // Marcar el stand como favorito en el componente
        this.favoritos[id_stand] = true;
      }
    }
  }
  isAdministrador(): boolean {

    return this.usuario !== null && this.usuario.role === false;
  }
  borrarStand(id_stand: number) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este stand?',
      accept: () => {
        this.oStandAjaxService.removeOne(id_stand).subscribe({
          next: () => {
            // Restablecer el filtro de categoría y actualizar la página de stands
            this.quitarFiltro();
            this.getPage();
            this.oMatSnackBar.open('El stand ha sido eliminado exitosamente', '', { duration: 2000 });
          },
          error: () => {
            this.oMatSnackBar.open('Error al eliminar el elemento', '', { duration: 2000 });
          }
        });
      }
    });
  }
  


  ref: DynamicDialogRef | undefined;
  doView(u: IStand) {
    this.ref = this.oDialogService.open(UserStandDetailUnroutedComponent, {
        data: {
            id: u.id
        },
        header: 'Vista Stand', // Establece el encabezado directamente
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
    });
}

  onPageChange(event: PaginatorState) {
    this.oPaginatorState.rows = event.rows;
    this.oPaginatorState.page = event.page;
    this.getPage();
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
 
  doOrder(fieldorder: string) {
    this.orderField = fieldorder;
    if (this.orderDirection == "asc") {
      this.orderDirection = "desc";
    } else {
      this.orderDirection = "asc";
    }
    this.getPage();
  }

  getPage(): void {

    if (!this.filtrandoPorCategoria) {
      this.id_categoria = 0;
    }
  
   
    this.oStandAjaxService.getPage(
      this.oPaginatorState.rows, 
      this.oPaginatorState.page, 
      this.orderField, 
      this.orderDirection, 
      
    ).subscribe({
      next: (data: IStandPage) => {
        this.oStandPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        this.stand = data.content;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
  
  
  quitarFiltro(): void {
    this.id_categoria = 0; 
    this.filtrandoPorCategoria = false;
    this.getPage(); 
  }
  
  postNuevoStand(): void {
    if (this.SessionAjaxService.isSessionActive()) {

      this.ref = this.oDialogService.open(UserStandFormUnroutedComponent, {
        data: {
          
          id_usuario: this.id_usuario
          
        },
        

        header: 'Nuevo Stand',
        width: '80%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false,
       
      });


      this.ref.onClose.subscribe({
        next: (v) => {
          this.getPage();
          if (v) {
            this.getPage();
          }
        }
      })
   
    }
  }
  postNuevoFavorito(id_stand: number): void {
    // Actualizar el estado de los favoritos primero
    this.favoritos[id_stand] = !this.favoritos[id_stand];
  
    this.oFavoritoAjaxService.verificarFavoritoRepetido(this.id_usuario, id_stand).subscribe({
        next: (favorito: boolean) => {
            if (favorito) {
                this.oFavoritoAjaxService.obtenerFavoritoRepetidoId(this.id_usuario, id_stand).subscribe({
                    next: (favoritoId: number) => {
                        this.eliminarFavoritoRepetido(favoritoId);
                    },
                    error: (error: HttpErrorResponse) => {
                        console.error('Error al obtener el ID del favorito repetido:', error);
                        this.oMatSnackBar.open('Error al obtener el ID del favorito repetido', 'Aceptar', { duration: 3000 });
                    }
                });
            } else {
                this.crearNuevoFavorito(id_stand);
            }
        },
        error: (error: HttpErrorResponse) => {
            console.error('Error al verificar el favorito repetido:', error);
            this.oMatSnackBar.open('Error al verificar el favorito repetido', 'Aceptar', { duration: 3000 });
        }
    });
}

  
  
  private crearNuevoFavorito(id_stand: number): void {
    const usuario: IUser = { id: this.id_usuario } as IUser;
    const stand: IStand = { id: id_stand } as IStand;
    const favorito: IFavorito = { usuario: usuario, stand: stand } as IFavorito;
  
    this.oFavoritoAjaxService.newOne(favorito).subscribe({
      next: () => {
        this.oMatSnackBar.open('Stand marcado como favorito', 'Aceptar', { duration: 3000 });
        this.favoritos[id_stand] = true; // Actualiza el estado de favorito
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al marcar el stand como favorito:', error);
        this.oMatSnackBar.open('Error al marcar el stand como favorito', 'Aceptar', { duration: 3000 });
      }
    });
    
  }
  
  private eliminarFavoritoRepetido(favoritoId: number): void {
    this.oFavoritoAjaxService.removeOne(favoritoId).subscribe({
      next: () => {
        this.oMatSnackBar.open('Stand eliminado de favoritos', 'Aceptar', { duration: 3000 });
        this.favoritos[this.id_stand] = false; // Actualiza el estado de favorito
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar el stand de favoritos:', error);
        this.oMatSnackBar.open('Error al eliminar el stand de favoritos', 'Aceptar', { duration: 3000 });
      }

    });
    
  }
}  