// admin-partida-form.component.ts

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IPartida, formOperation } from 'src/app/model/model.interfaces';  // Asegúrate de importar el modelo correcto
import { PartidaAjaxService } from 'src/app/service/partida.ajax.service.service';

@Component({
  selector: 'app-admin-partida-form-unrouted',
  templateUrl: './admin-partida-form-unrouted.component.html',
  styleUrls: ['./admin-partida-form-unrouted.component.css']
})
export class AdminPartidaFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  partidaForm!: FormGroup;
  oPartida: IPartida = {} as IPartida;
  status: HttpErrorResponse | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private partidaAjaxService: PartidaAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar,
  ) {
    this.initializeForm(this.oPartida);
  }

  initializeForm(oPartida: IPartida) {
    this.partidaForm = this.formBuilder.group({
      fecha: [oPartida.fecha, Validators.required],
      ganador: [oPartida.ganador?.nombre],
      // Agrega más campos según sea necesario
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.partidaAjaxService.getOne(this.id).subscribe({
        next: (data: IPartida) => {
          this.oPartida = data;
          this.initializeForm(this.oPartida);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.matSnackBar.open('Error al leer la partida del servidor', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.oPartida);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.partidaForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.partidaForm.valid) {
      if (this.operation == 'NEW') {
        this.partidaAjaxService.newOne(this.partidaForm.value).subscribe({
          next: (data: IPartida) => {
            this.oPartida = data;
            this.initializeForm(this.oPartida);
            this.matSnackBar.open('La partida se ha creado correctamente', '', { duration: 2000 });
            this.router.navigate(['/admin', 'partida', 'view', this.oPartida]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open('Error al crear la partida', '', { duration: 2000 });
          }
        });

      } else {
        this.partidaAjaxService.updateOne(this.partidaForm.value).subscribe({
          next: (data: IPartida) => {
            this.oPartida = data;
            this.initializeForm(this.oPartida);
            this.matSnackBar.open('La partida se ha actualizado correctamente', '', { duration: 2000 });
            this.router.navigate(['/admin', 'partida', 'view', this.oPartida.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.matSnackBar.open('Error al actualizar la partida', '', { duration: 2000 });
          }
        });
      }
    }
  }
}
