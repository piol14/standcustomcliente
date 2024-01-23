import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IStand, formOperation } from 'src/app/model/model.interfaces'; // Asegúrate de importar el modelo correcto
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';

@Component({
  selector: 'app-admin-stand-form-unrouted',
  templateUrl: './admin-stand-form-unrouted.component.html',
  styleUrls: ['./admin-stand-form-unrouted.component.css']
})
export class AdminStandFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  standForm!: FormGroup;
  oStand: IStand = {} as IStand;
  status: HttpErrorResponse | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private standService: StandAjaxService, // Asegúrate de usar el servicio correcto
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.initializeForm(this.oStand);
  }

  initializeForm(oStand: IStand) {
    this.standForm = this.formBuilder.group({
      id: [oStand.id],
      nombre: [oStand.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      descripcion: [oStand.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      stand: [oStand.ataque, [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      // Agrega aquí los demás campos según tu modelo
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.standService.getOne(this.id).subscribe({
        next: (data: IStand) => {
          this.oStand = data;
          this.initializeForm(this.oStand);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error al leer el stand del servidor', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.oStand);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.standForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.standForm.valid) {
      if (this.operation == 'NEW') {
        this.standService.newOne(this.standForm.value).subscribe({
          next: (data: IStand) => {
            this.oStand = data;
            this.initializeForm(this.oStand);
            this.snackBar.open('El stand se ha creado correctamente', '', { duration: 2000 });
            this.router.navigate(['/admin', 'stand', 'view', this.oStand]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Error al crear el stand', '', { duration: 2000 });
          }
        });

      } else {
        this.standService.updateOne(this.standForm.value).subscribe({
          next: (data: IStand) => {
            this.oStand = data;
            this.initializeForm(this.oStand);
            this.snackBar.open('El stand se ha actualizado correctamente', '', { duration: 2000 });
            this.router.navigate(['/admin', 'stand', 'view', this.oStand.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.snackBar.open('Error al actualizar el stand', '', { duration: 2000 });
          }
        });
      }
    }
  }
}
