import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Input, OnInit } from '@angular/core';
import { UserOpinionFormUnroutedComponent } from '../user-opinion-form-unrouted/user-opinion-form-unrouted.component';
import { HttpErrorResponse } from '@angular/common/http';
import { IOpinion, IOpinionPage, IStand, IUser } from 'src/app/model/model.interfaces';
import { PaginatorState } from 'primeng/paginator';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';

import {  MessageService } from 'primeng/api';
@Component({
  selector: 'app-user-opinion-plist-unrouted',
  templateUrl: './user-opinion-plist-unrouted.component.html',
  styleUrls: ['./user-opinion-plist-unrouted.component.css'],
  providers: [ MessageService, ConfirmationService] // Add the providers to the component
})
export class UserOpinionPlistUnroutedComponent implements OnInit {

  @Input() forceReload: Subject<boolean> = new Subject<boolean>();
  @Input() id_stand: number = 0;
  @Input() id_usuario: number = 0;
  cd: any;


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
    private confirmationService: ConfirmationService,
    private MessageService: MessageService,
    private DialogService: DialogService,
    private MatSnackBar: MatSnackBar,
    private Router :Router
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


  isAdministrador(): boolean {

    return this.usuario !== null && this.usuario.role === false;
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
   

    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar esta opinión?',
      accept: () => {
        this.oOpinionAjaxService.removeOne(id_opinion).subscribe({
          next: () => {
            this.getOpiniones();
            this.MatSnackBar.open('La opinión ha sido eliminada', 'Cerrar', {
              duration: 2000,
            });
            console.log(this.usuario?.id);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.MatSnackBar.open('La opinión no se ha podido eliminar', 'Cerrar', {
              duration: 2000,
            });
          },
        });
      },
      reject: () => {
        // Lógica para manejar si el usuario rechaza la eliminación
        console.log('La eliminación de la opinión ha sido cancelada');
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
   
    }else {
  this.MatSnackBar.open('Debes estar logueado para valorar un producto', 'Aceptar', { duration: 3000 });
  this.Router.navigate(['/login']);
    }
  }
}