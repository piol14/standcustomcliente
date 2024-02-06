import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICategoria, formOperation } from 'src/app/model/model.interfaces';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';

@Component({
  selector: 'app-admin-categoria-form-unrouted',
  templateUrl: './admin-categoria-form-unrouted.component.html',
  styleUrls: ['./admin-categoria-form-unrouted.component.css']
})
export class AdminCategoriaFormUnroutedComponent implements OnInit {

    @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  categoriaForm!: FormGroup;
  oCategoria: ICategoria = {} as ICategoria;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  constructor(
    private oFormBuilder: FormBuilder,
    private oCategoriaAjaxService: CategoriaAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService,
  ) {
    this.initializeForm(this.oCategoria);
  }
  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oCategoriaAjaxService.getOne(this.id).subscribe({
        next: (data: ICategoria) => {
          this.oCategoria = data;
          this.initializeForm(this.oCategoria);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open('Error al leer la categoria servidor', '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oCategoria);
    }
  }

  initializeForm(oCategoria: ICategoria) {
    this.categoriaForm = this.oFormBuilder.group({
      usuario:this.oFormBuilder.group({
        id: [oCategoria.id, Validators.required],
      }),
      nombre: [oCategoria.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      
    });

  
  }
    public hasError = (controlName: string, errorName: string) => {
      return this.categoriaForm.controls[controlName].hasError(errorName);
    }

  onSubmit() {
    if (this.categoriaForm.valid) {
      if (this.operation == 'NEW') {
        this.oCategoriaAjaxService.newOne(this.categoriaForm.value).subscribe({
          next: (data: ICategoria) => {
            this.oCategoria = data;
            this.initializeForm(this.oCategoria);
            this.oMatSnackBar.open('La categoria se ha creado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'detalle-partida', 'view',data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al crear la categoria', '', { duration: 2000 });
          }
        })

      } else {
        this.oCategoriaAjaxService.updateOne(this.categoriaForm.value).subscribe({
          next: (data: ICategoria) => {
            this.oCategoria = data;
            this.initializeForm(this.oCategoria);
            this.oMatSnackBar.open('La categoria se ha actualizado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'detalle-partida', 'view', this.oCategoria.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al actualizar la categoria', '', { duration: 2000 });
          }
        })
      }
    }
  }
}
