import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { UserUserFormUnroutedComponent } from '../user-user-form-unrouted/user-user-form-unrouted.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-user-detail-unrouted',
  templateUrl: './user-user-detail-unrouted.component.html',
  styleUrls: ['./user-user-detail-unrouted.component.css']
})
export class UserUserDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;
  @Input() id_usuario: number = 1;
  @Input() forceReload: Subject<boolean> = new Subject<boolean>();

  constructor(
    private SessionAjaxService: SessionAjaxService,
    private DialogService: DialogService,
    private oUserAjaxService: UserAjaxService,
    @Optional() public ref:DynamicDialogRef,
    @Optional() public config:DynamicDialogConfig
  ) {     
    if (config){
      if (config.data){
        this.id = config.data.id;
      }
    }    
  }

  ngOnInit() {
    this.getOne();
    this.forceReload.subscribe({
      next: (v) => {
        if (v) {
          this.getOne();
        }
      }
    });
  }
  getOne(): void {
    this.oUserAjaxService.getOne(this.id).subscribe({    
      next: (data: IUser) => {
        this.oUser = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }
  EditarPerfil(): void {
    if (this.SessionAjaxService.isSessionActive()) {
      this.ref = this.DialogService.open(UserUserFormUnroutedComponent, {
        data: {
          id: this.id_usuario 
        },
        header: 'Editar perfil',
        width: '80%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: false,
      });
        this.ref.onClose.subscribe({
          next: (v) => {
            this.getOne();
            if (v) {
              this.getOne();
            }
          }
        })
     
      }
      
    }
    
 
  }
  
  
  

