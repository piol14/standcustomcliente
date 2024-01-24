// admin-detalle-partida-form-unrouted.component.ts

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUsuarioStand, formOperation } from 'src/app/model/model.interfaces';
import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';

@Component({
  selector: 'app-admin-detallePartida-form-unrouted',
  templateUrl: './admin-detallePartida-form-unrouted.component.html',
  styleUrls: ['./admin-detallePartida-form-unrouted.component.css']
})
export class AdminDetallePartidaFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  detallePartidaForm!: FormGroup;
  oDetallePartida: IUsuarioStand = {} as IUsuarioStand;
  status: HttpErrorResponse | null = null;

  constructor(
    private oFormBuilder: FormBuilder,
    private oDetallePartidaAjaxService: DetallePartidaAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
  ) {
    this.initializeForm(this.oDetallePartida);
  }

  initializeForm(oDetallePartida: IUsuarioStand) {
    this.detallePartidaForm = this.oFormBuilder.group({
      usuario: [oDetallePartida.usuario?.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      stand: [oDetallePartida.stand?.nombre, Validators.required]
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oDetallePartidaAjaxService.getOne(this.id).subscribe({
        next: (data: IUsuarioStand) => {
          this.oDetallePartida = data;
          this.initializeForm(this.oDetallePartida);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open('Error al leer el detalle de la partida del servidor', '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oDetallePartida);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.detallePartidaForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.detallePartidaForm.valid) {
      if (this.operation == 'NEW') {
        this.oDetallePartidaAjaxService.newOne(this.detallePartidaForm.value).subscribe({
          next: (data: IUsuarioStand) => {
            this.oDetallePartida = data;
            this.initializeForm(this.oDetallePartida);
            this.oMatSnackBar.open('El detalle de la partida se ha creado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'detalle-partida', 'view', this.oDetallePartida]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al crear el detalle de la partida', '', { duration: 2000 });
          }
        })

      } else {
        this.oDetallePartidaAjaxService.updateOne(this.detallePartidaForm.value).subscribe({
          next: (data: IUsuarioStand) => {
            this.oDetallePartida = data;
            this.initializeForm(this.oDetallePartida);
            this.oMatSnackBar.open('El detalle de la partida se ha actualizado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'detalle-partida', 'view', this.oDetallePartida.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al actualizar el detalle de la partida', '', { duration: 2000 });
          }
        })
      }
    }
  }
}

