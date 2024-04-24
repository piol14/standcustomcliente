import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { formOperation, IFavorito, IUser, IStand } from 'src/app/model/model.interfaces';
import {  FavoritoAjaxService } from 'src/app/service/favorito.ajax.service.service';
import { AdminStandSelectionUnroutedComponent } from '../../stand/admin-stand-selection-unrouted/admin-stand-selection-unrouted.component';
import { AdminUsuarioSelectionUnroutedComponent } from '../../usuario/admin-usuario-selection-unrouted/admin-usuario-selection-unrouted.component';

@Component({
  selector: 'app-admin-favorito-form-unrouted',
  templateUrl: './admin-favorito-form-unrouted.component.html',
  styleUrls: ['./admin-favorito-form-unrouted.component.css']
})
export class AdminFavoritoFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  favoritoForm!: FormGroup;
  oFavorito: IFavorito= {} as IFavorito; // Asegúrate de ajustar el tipo según tu modelo de opinión
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  constructor(
    private oFormBuilder: FormBuilder,
    private oFavoritoAjaxService: FavoritoAjaxService, // Asegúrate de importar el servicio correcto
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService,
  ) {
    this.initializeForm(this.oFavorito);
  }

  initializeForm(oFavorito: IFavorito) {
    this.favoritoForm = this.oFormBuilder.group({
      id: [oFavorito.id],
      usuario:this.oFormBuilder.group({
        id: [oFavorito.usuario?.id, Validators.required],
      }),
    
      stand:this.oFormBuilder.group({
        id: [oFavorito.stand?.id, Validators.required],
      }),
    
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oFavoritoAjaxService.getOne(this.id).subscribe({
        next: (data: any) => {
          this.oFavorito = data;
          this.initializeForm(this.oFavorito);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open('Error al leer la opinión del servidor', '', { duration: 2000 });
        }
      })
    } else {
      this.initializeForm(this.oFavorito);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.favoritoForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.favoritoForm.valid) {
      if (this.operation == 'NEW') {
        this.oFavoritoAjaxService.newOne(this.favoritoForm.value).subscribe({
          next: (data: any) => {
            this.oFavorito = data;
            this.initializeForm(this.oFavorito);
            this.oMatSnackBar.open('El favorito se ha creado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'favorito', 'view', this.oFavorito]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al crear el favorito', '', { duration: 2000 });
          }
        })

      } else {
        this.oFavoritoAjaxService.updateOne(this.favoritoForm.value).subscribe({
          next: (data: any) => {
            this.oFavorito = data;
            this.initializeForm(this.oFavorito);
            this.oMatSnackBar.open('La opinión se ha actualizado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'favorito', 'view', this.oFavorito.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al actualizar el favorito', '', { duration: 2000 });
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
      this.oFavorito.usuario = oUser;
      this.favoritoForm.controls['usuario'].patchValue({ id: oUser.id })
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
    this.oFavorito.stand = oStand;
    this.favoritoForm.controls['stand'].patchValue({ id: oStand.id })
  }
});
}
}


