// admin-opinion-form-unrouted.component.ts

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUser, IStand, formOperation, IOpinion } from 'src/app/model/model.interfaces';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';
import { AdminUsuarioSelectionUnroutedComponent } from '../../usuario/admin-usuario-selection-unrouted/admin-usuario-selection-unrouted.component';
import { AdminStandSelectionUnroutedComponent } from '../../stand/admin-stand-selection-unrouted/admin-stand-selection-unrouted.component';

@Component({
  selector: 'app-admin-opinion-form-unrouted',
  templateUrl: './admin-opinion-form-unrouted.component.html',
  styleUrls: ['./admin-opinion-form-unrouted.component.css']
})
export class AdminOpinionFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  opinionForm!: FormGroup;
  oOpinion: IOpinion= {} as IOpinion; // Asegúrate de ajustar el tipo según tu modelo de opinión
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  constructor(
    private oFormBuilder: FormBuilder,
    private oOpinionAjaxService: OpinionAjaxService, // Asegúrate de importar el servicio correcto
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService,
  ) {
    this.initializeForm(this.oOpinion);
  }

  initializeForm(oOpinion: IOpinion) {
    this.opinionForm = this.oFormBuilder.group({
      id: [oOpinion.id],
      usuario:this.oFormBuilder.group({
        id: [oOpinion.usuario?.id, Validators.required],
      }),
      descripcion: [oOpinion.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    
      stand:this.oFormBuilder.group({
        id: [oOpinion.stand?.id, Validators.required],
      }),
    
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oOpinionAjaxService.getOne(this.id).subscribe({
        next: (data: any) => {
          this.oOpinion = data;
          this.initializeForm(this.oOpinion);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open('Error al leer la opinión del servidor', '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oOpinion);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.opinionForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.opinionForm.valid) {
      if (this.operation == 'NEW') {
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
        })

      } else {
        this.oOpinionAjaxService.updateOne(this.opinionForm.value).subscribe({
          next: (data: any) => {
            this.oOpinion = data;
            this.initializeForm(this.oOpinion);
            this.oMatSnackBar.open('La opinión se ha actualizado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'opinion', 'view', this.oOpinion.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al actualizar la opinión', '', { duration: 2000 });
          }
        })
      }
    }
  }

  onShowUsuarioSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminUsuarioSelectionUnroutedComponent, {
      header: 'Select a User', // Reemplazar con el texto deseado
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  
  this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
    if (oUser) {
      this.oOpinion.usuario = oUser;
      this.opinionForm.controls['usuario'].patchValue({ id: oUser.id })
    }
  });
}

onShowStandSelection() {
  this.oDynamicDialogRef = this.oDialogService.open(AdminStandSelectionUnroutedComponent, {
    header: 'Selecciona un stand', // Reemplazar con el texto deseado
    width: '80%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true
  });

this.oDynamicDialogRef.onClose.subscribe((oStand: IStand) => {
  if (oStand) {
    this.oOpinion.stand = oStand;
    this.opinionForm.controls['stand'].patchValue({ id: oStand.id })
  }
});
}
}
