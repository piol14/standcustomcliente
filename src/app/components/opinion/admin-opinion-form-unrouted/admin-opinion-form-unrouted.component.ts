// admin-opinion-form-unrouted.component.ts

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser, IStand, formOperation, IOpinion } from 'src/app/model/model.interfaces';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';

@Component({
  selector: 'app-admin-opinion-form-unrouted',
  templateUrl: './admin-opinion-form-unrouted.component.html',
  styleUrls: ['./admin-opinion-form-unrouted.component.css']
})
export class AdminOpinionFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  opinionForm!: FormGroup;
  oOpinion: any = {}; // Asegúrate de ajustar el tipo según tu modelo de opinión
  status: HttpErrorResponse | null = null;

  constructor(
    private oFormBuilder: FormBuilder,
    private oOpinionAjaxService: OpinionAjaxService, // Asegúrate de importar el servicio correcto
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
  ) {
    this.initializeForm(this.oOpinion);
  }

  initializeForm(oOpinion: IOpinion) {
    this.opinionForm = this.oFormBuilder.group({
      usuario: [oOpinion.usuario.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      descripcion: [oOpinion.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      numero_estrellas: [oOpinion.numero_estrellas, [Validators.required, Validators.min(1), Validators.max(5)]],
      stand: [oOpinion.stand.nombre, Validators.required]
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
}
