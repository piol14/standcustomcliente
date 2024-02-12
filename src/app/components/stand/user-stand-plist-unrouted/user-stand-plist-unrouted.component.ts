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

@Component({
  selector: 'app-user-stand-plist-unrouted',
  templateUrl: './user-stand-plist-unrouted.component.html',
  styleUrls: ['./user-stand-plist-unrouted.component.css']
})
export class UserStandPlistUnroutedComponent implements OnInit {


  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_usuario: number = 0;
  categoria: ICategoria[] = [];
  stand: IStand[] = [];
  oPage: ICategoriaPage | undefined;
  @Input() id_categoria: number = 0;
  value: string = '';
  oStandPage: IStandPage | undefined;
  orderField: string = "id";
  standsPorPagina: number = 8;
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  oStandToRemove: IStand | null = null;
  oUsuario: IUser | null = null;
  oCategoria: ICategoria | null = null;
  idCategoriaFiltrada: number | null = null;
  filtrandoPorCategoria: boolean = false;
  constructor(
    private oStandAjaxService: StandAjaxService,
    public oDialogService: DialogService,
    private oConfirmationService: ConfirmationService,
    private oMatSnackBar: MatSnackBar
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
  filtrarPorCategoria(idCategoria: number): void {
    this.id_categoria = idCategoria;
    this.getPage(); 
    this.idCategoriaFiltrada = idCategoria;
    this.filtrandoPorCategoria = true;
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
    this.ref = this.oDialogService.open(AdminStandDetailUnroutedComponent, {
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
    this.oStandAjaxService.getPage(this.oPaginatorState.rows, this.oPaginatorState.page, this.orderField, this.orderDirection, this.id_usuario, this.id_categoria).subscribe({
      next: (data: IStandPage) => {
        this.oStandPage = data;
        this.oPaginatorState.pageCount = data.totalPages;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
  quitarFiltro(): void {
    this.value = ''; // Limpiar el valor del filtro de búsqueda
    console.log(this.value);
    
    this.oStandAjaxService.getPage(
        this.standsPorPagina,
        this.oPaginatorState.page,
        this.orderField,
        this.orderDirection,
        0,
        0 
    ).subscribe({
        next: (data: IStandPage) => {
            this.oPage = data;
            this.oPaginatorState.pageCount = data.totalPages;
            this.stand = data.content;
            console.log(this.stand);
        },
        error: (error: HttpErrorResponse) => {
            this.status = error;
        }
    });
    
    this.id_categoria = 0; // Restablecer el valor de id_categoria a 0
    console.log(this.id_categoria);
    
    this.filtrandoPorCategoria = false; // Desactivar la bandera de filtrado por categoría
    console.log(this.filtrandoPorCategoria);
}

}

