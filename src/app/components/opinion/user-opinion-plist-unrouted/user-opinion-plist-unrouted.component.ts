import { Component, Input, OnInit } from '@angular/core';
import { UserOpinionFormUnroutedComponent } from '../user-opinion-form-unrouted/user-opinion-form-unrouted.component';
import { HttpErrorResponse } from '@angular/common/http';
import { IOpinion, IOpinionPage, IStand, IUser } from 'src/app/model/model.interfaces';
import { PaginatorState } from 'primeng/paginator';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
  selector: 'app-user-opinion-plist-unrouted',
  templateUrl: './user-opinion-plist-unrouted.component.html',
  styleUrls: ['./user-opinion-plist-unrouted.component.css'],
  providers: [ MessageService, ConfirmationService, DialogService] // Add the providers to the component
})
export class UserOpinionPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_stand: number = 0;
  @Input() id_usuario: number = 0;



  page: IOpinionPage   | undefined;
  stand: IStand | null = null;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  paginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  usuario: IUser | null = null;
  ref: DynamicDialogRef | undefined;
  opiniones: IOpinion[] = [];


  constructor(
    private oOpinionAjaxService: OpinionAjaxService,
    private oSessionAjaxService: SessionAjaxService,
    private ConfirmationService: ConfirmationService,
    private MessageService: MessageService,
    private DialogService: DialogService,

  ) { }

  ngOnInit() {
    this.getOpiniones();

    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getOpiniones();}
      }
    });
    this.oSessionAjaxService.getSessionUser()?.subscribe({
      next: (usuario: IUser) => {
        this.usuario = usuario;
        this.id_usuario = usuario.id;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }

 

  onPageChange(event: PaginatorState) {
    this.paginatorState.rows = event.rows;
    this.paginatorState.page = event.page;
  
  }



 

  getOpiniones() {
    const rows: number = this.paginatorState.rows ?? 0;
    const page: number = this.paginatorState.page ?? 0;
    this.oOpinionAjaxService.getOpinionPageByStand(this.id_stand, page, rows, this.orderField, this.orderDirection).subscribe({
      next: (page: IOpinionPage ) => {
        this.page = page;
        this.paginatorState.pageCount = page.totalPages;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    })
  }


  recargarOpiniones() {
    this.getOpiniones();
  }

  isUsuarioOpinion(opinion: IOpinion): boolean {
    return this.usuario !== null && opinion.usuario.id === this.usuario.id;
   
  }

  borrarOpinion(id_opinion: number) {
    this.ConfirmationService.confirm({
   
      message: '¿Estás seguro de que quieres borrar la valoración?',
      accept: () => {
        console.log(id_opinion);
        this.oOpinionAjaxService.removeOne(id_opinion).subscribe({
          next: () => {
            this.getOpiniones();
            this.MessageService.add({ severity: 'success', summary: 'Success', detail: 'La valoración ha sido eliminada' });
            console.log(this.usuario?.id);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.MessageService.add({ severity: 'error', summary: 'Error', detail: 'La valoración no se ha podido eliminar' });
          }
        })
      }
    });
    
  }

  postNuevaOpinion(): void {
    if (this.id_stand > 0 && this.oSessionAjaxService.isSessionActive()) {

      this.ref = this.DialogService.open(UserOpinionFormUnroutedComponent, {
        data: {
          id_stand: this.id_stand,
          id_usuario: this.id_usuario,
          
        },
        
        header: 'Nueva valoración',
        width: '40%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false
      });

      this.ref.onClose.subscribe({
        next: (v) => {
          if (v) {
            this.getOpiniones();
          }
        }
      })
   
    }
  }
}