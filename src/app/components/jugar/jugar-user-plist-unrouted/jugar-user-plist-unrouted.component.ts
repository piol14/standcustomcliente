import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ICategoria, IStand, IUser, IPartida, IDetallePartida, IStandPage, ICategoriaPage } from 'src/app/model/model.interfaces';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';
import { PartidaAjaxService } from 'src/app/service/partida.ajax.service.service';
import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';
import { PaginatorState } from 'primeng/paginator';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-jugar-user-plist-unrouted',
  templateUrl: './jugar-user-plist-unrouted.component.html',
  styleUrls: ['./jugar-user-plist-unrouted.component.css']
})
export class JugarUserPlistUnroutedComponent implements OnInit {
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  @Input() id_categoria: number = 9;
  categoria: ICategoria[] = [];
  standPage: IStand[] = [];
  oPage: ICategoriaPage | undefined;
  
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oCategoriaToRemove: ICategoria | null = null;
  value: string = '';
  oStandPage: IStandPage | undefined;
 
  standsPorPagina: number = 8;

  
 
  oStandToRemove: IStand | null = null;
  usuario: IUser | null = null;
  stand: IStand | null = null;
  partida: IPartida |null = null ;
  oCategoria: ICategoria | null = null;
  detallePartida: IDetallePartida= {} as IDetallePartida;
    idCategoriaFiltrada: number | null = null;
  filtrandoPorCategoria: boolean = false;
oPartida:IPartida= {} as IPartida;
  constructor(
    private SessionAjaxService: SessionAjaxService,
    private oCategoriaAjaxService: CategoriaAjaxService,
    private oStandAjaxService: StandAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar,
    private DetallePartidaAjaxService: DetallePartidaAjaxService,
    private PartidaAjaxService: PartidaAjaxService,
    private router: Router,
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
  this.getCategorias(); // Llama siempre a getCategorias() al inicializar el componente

  if (this.id_categoria > 0) {
    this.getCategorias(); // Si id_categoria es mayor que 0, llama nuevamente a getCategorias()
  }


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
  borrarStand(id_stand: number) {
    this.oConfirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este elemento?',
      accept: () => {
        this.oStandAjaxService.removeOne(id_stand).subscribe({
          next: () => {
            this.getPage();
            this.oMatSnackBar.open('El elemento ha sido eliminado exitosamente', '', { duration: 2000 });
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al eliminar el elemento', '', { duration: 2000 });
            // Puedes manejar el error según tus necesidades
          }
        });
      }
    });
  }

  ref: DynamicDialogRef | undefined;
  

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
    // Si no hay ninguna categoría seleccionada, restablece id_categoria a 0
    if (!this.filtrandoPorCategoria) {
      this.id_categoria = 0;
    }
  
    // Luego, realiza la solicitud de la página de stands
    this.oStandAjaxService.getPage(
      this.oPaginatorState.rows, 
      this.oPaginatorState.page, 
      this.orderField, 
      this.orderDirection, 
      this.id_usuario, 
      this.id_categoria
    ).subscribe({
      next: (data: IStandPage) => {
        this.oStandPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
        this.standPage = data.content;
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
  crearTodo(): void {
    const partida: IPartida = {
      id:this.oPartida.id,
      fecha: "ola",
      usuario: this.usuario
    };

    this.PartidaAjaxService.newOne(partida).subscribe({
      next: (partida: IPartida) => {
        const detallePartidaUsuario: IDetallePartida = {
          id:this.detallePartida.id,
          usuario: this.usuario!,
          stand: this.stand!,
          partida:this.oPartida
        };

        this.DetallePartidaAjaxService.newOne(detallePartidaUsuario).subscribe({
          next: () => {
            this.oMatSnackBar?.open('El stand se ha creado correctamente', '', { duration: 2000 });
            this.router.navigate(['/home']);
          },
          error: () => {
            this.oMatSnackBar?.open('Error al crear el detalle de partida para el usuario', '', { duration: 2000 });
          }
        });
      },
      error: () => {
        this.oMatSnackBar?.open('Error al crear la partida', '', { duration: 2000 });
      }
    });
  }
}