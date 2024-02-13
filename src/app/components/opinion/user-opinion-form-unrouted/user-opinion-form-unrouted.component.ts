import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOpinion, formOperation, IUser } from 'src/app/model/model.interfaces';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service'; // Importa el servicio de sesión

@Component({
  selector: 'app-user-opinion-form-unrouted',
  templateUrl: './user-opinion-form-unrouted.component.html',
  styleUrls: ['./user-opinion-form-unrouted.component.css']
})
export class UserOpinionFormUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  opinionForm!: FormGroup;
  oOpinion: IOpinion= {} as IOpinion;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;

  constructor(
    private oFormBuilder: FormBuilder,
    private oOpinionAjaxService: OpinionAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService,
    private sessionService: SessionAjaxService // Inyecta el servicio de sesión
  ) {
    this.initializeForm(this.oOpinion);
  }

  ngOnInit() {
    if(this.sessionService.getSessionUser() !== null) {
    this.sessionService.getSessionUser().subscribe({
      next: (user: IUser | null) => {
        if (user !== null) {
          if (this.oOpinion.usuario !== null) {
            this.oOpinion.usuario.id = user.id; // Asigna el id del usuario activo a la opinión
            this.initializeForm(this.oOpinion);
          } else {
            console.error('El usuario en oOpinion es null');
            // Manejar el caso en el que oOpinion.usuario sea null
          }
        } else {
          console.error('No se pudo obtener el usuario activo');
          // Manejar el caso en el que no se pueda obtener el usuario activo
        }
      },
      error: (error: any) => {
        console.error('Error obteniendo el usuario activo:', error);
        // Manejar el error
      }
    });
  }
}
  

  initializeForm(oOpinion: IOpinion) {
    this.opinionForm = this.oFormBuilder.group({
      descripcion: [oOpinion.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  onSubmit() {
    if (this.opinionForm.valid) {
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
