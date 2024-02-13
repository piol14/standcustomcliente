
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOpinion, formOperation, IUser, IStand } from 'src/app/model/model.interfaces';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service'; // Importa el servicio de sesión
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';
import { MessageService } from 'primeng/api'; // Import the MessageService

@Component({
  selector: 'app-user-opinion-form-unrouted',
  templateUrl: './user-opinion-form-unrouted.component.html',
  styleUrls: ['./user-opinion-form-unrouted.component.css'],
  providers: [MessageService] // Add the provider to the component
})
export class UserOpinionFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  opinionForm!: FormGroup;
  oOpinion: IOpinion= {} as IOpinion;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  opinion: IOpinion = { usuario: { id: 0 }, stand: { id: 0 } } as IOpinion;

  id_usuario: number | undefined;
  id_stand: number | undefined;
  usuario: IUser | undefined;
  stand: IStand | undefined;

  constructor(
    private oFormBuilder: FormBuilder,
    private oOpinionAjaxService: OpinionAjaxService,
    private oUserAjaxService: UserAjaxService,
    private oStandAjaxService: StandAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService,
    private sessionService: SessionAjaxService,
    public oDynamicDialogConfig: DynamicDialogConfig,
    private messageService: MessageService // Add the missing parameter with the correct type
  ) {
    this.id_usuario = this.oDynamicDialogConfig.data.id_usuario;
    console.log(this.id_usuario)
    this.id_stand = this.oDynamicDialogConfig.data.id_producto;
    this.initializeForm(this.oOpinion);
  }

 
  ngOnInit() {
    
    if(this.id_usuario !== undefined) {
      this.oUserAjaxService.getOne(this.id_usuario).subscribe({
        next:(usuario: IUser) => {
          this.usuario = usuario;
          console.log(this.usuario)
        },
        error: (error) => {
          this.status = error
          this.messageService.add({ severity: 'error',detail: 'No se puede crear la valoración',  life: 2000});
        }
      });
    
    }
    
    if(this.id_stand !== undefined) {
      this.oStandAjaxService.getOne(this.id_stand).subscribe({
        next:(stand: IStand) => {
          this.stand = stand;
          console.log(this.stand)
        },
        error: (error) => {
          this.status = error
          this.messageService.add({ severity: 'error', detail: 'Aceptar',  life: 2000});
        }
      });
    }
    
    this.initializeForm(this.opinion);
    
    }
  

  initializeForm(oOpinion: IOpinion) {
    this.opinionForm = this.oFormBuilder.group({
      descripcion: [oOpinion.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  onSubmit() {
    if (this.opinionForm.valid) {
      const opinion = this.opinionForm.value;
      opinion.usuario = this.usuario;
      console.log( "iD USUARIO: " + opinion.usuario)
      opinion.stand = this.stand;
      console.log("ID PRODUCTO" + opinion.stand)
  
      this.oOpinionAjaxService.newOne(this.opinionForm.value).subscribe({
        next: (data: any) => {
          this.oOpinion = data;
          this.initializeForm(this.oOpinion);
          this.oMatSnackBar.open('La opinión se ha creado correctamente', '', { duration: 2000 });
          this.oRouter.navigate(['/admin', 'opinion', 'view', this.oOpinion]);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open('Error al crear la opinión', '', { duration: 2000 });
        }
      });
    }
  }
}
