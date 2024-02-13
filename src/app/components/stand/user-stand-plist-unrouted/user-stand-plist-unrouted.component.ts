import { ICategoria, ICategoriaPage, IStand, IUser } from './../../../model/model.interfaces';
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

@Component({
  selector: 'app-user-stand-plist-unrouted',
  templateUrl: './user-stand-plist-unrouted.component.html',
  styleUrls: ['./user-stand-plist-unrouted.component.css']
})
export class UserStandPlistUnroutedComponent implements OnInit {


  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  @Input() id_categoria: number = 0;
  categoria: ICategoria[] = [];
  stand: IStand[] = [];
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
  oUsuario: IUser | null = null;
  oCategoria: ICategoria | null = null;
  idCategoriaFiltrada: number | null = null;
  filtrandoPorCategoria: boolean = false;

  constructor(
    private oCategoriaAjaxService: CategoriaAjaxService,
    private oStandAjaxService: StandAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
   
    this.getPage();
    this.getCategorias();
    if (this.id_categoria > 0) {
      this.getCategorias();
    }
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
  doRemove(stand: IStand) {
    this.oConfirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este elemento?',
      accept: () => {
        this.oStandAjaxService.removeOne(stand.id).subscribe({
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
  
    

}

