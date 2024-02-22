// admin-detalle-partida-form-unrouted.component.ts

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IStand, IUser, IDetallePartida, formOperation, IPartida } from 'src/app/model/model.interfaces';
import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';
import { AdminStandSelectionUnroutedComponent } from '../../stand/admin-stand-selection-unrouted/admin-stand-selection-unrouted.component';
import { AdminUsuarioSelectionUnroutedComponent } from '../../usuario/admin-usuario-selection-unrouted/admin-usuario-selection-unrouted.component';
import { AdminPartidaSelectionUnroutedComponent } from '../../partida/admin-partida-selection-unrouted/admin-partida-selection-unrouted.component';

@Component({
  selector: 'app-admin-detallePartida-form-unrouted',
  templateUrl: './admin-detallePartida-form-unrouted.component.html',
  styleUrls: ['./admin-detallePartida-form-unrouted.component.css']
})
export class AdminDetallePartidaFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  detallePartidaForm!: FormGroup;
  oDetallePartida: IDetallePartida = {} as IDetallePartida;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  constructor(
    private oFormBuilder: FormBuilder,
    private oDetallePartidaAjaxService: DetallePartidaAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    public oDialogService: DialogService,
  ) {
    this.initializeForm(this.oDetallePartida);
  }

  initializeForm(oDetallePartida: IDetallePartida) {
    this.detallePartidaForm = this.oFormBuilder.group({
      usuario:this.oFormBuilder.group({
        id: [oDetallePartida.usuario?.id, Validators.required],
      }),
      stand:this.oFormBuilder.group({
        id: [oDetallePartida.stand?.id, Validators.required],
      }),
      partida:this.oFormBuilder.group({
        id: [oDetallePartida.partida?.id, Validators.required],
      }),
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.oDetallePartidaAjaxService.getOne(this.id).subscribe({
        next: (data: IDetallePartida) => {
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
          next: (data: IDetallePartida) => {
            this.oDetallePartida = data;
            this.initializeForm(this.oDetallePartida);
            this.oMatSnackBar.open('El detalle de la partida se ha creado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'detallePartida', 'view',data]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al crear el detalle de la partida', '', { duration: 2000 });
          }
        })

      } else {
        this.oDetallePartidaAjaxService.updateOne(this.detallePartidaForm.value).subscribe({
          next: (data: IDetallePartida) => {
            this.oDetallePartida = data;
            this.initializeForm(this.oDetallePartida);
            this.oMatSnackBar.open('El detalle de la partida se ha actualizado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/admin', 'detallePartida', 'view', this.oDetallePartida.id]);
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al actualizar el detalle de la partida', '', { duration: 2000 });
          }
        })
      }
    }
  }

  onShowUsuarioSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminUsuarioSelectionUnroutedComponent, {
      header: 'Selecciona un usuario', // Reemplazar con el texto deseado
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  
  this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
    if (oUser) {
      this.oDetallePartida.usuario = oUser;
      this.detallePartidaForm.controls['usuario'].patchValue({ id: oUser.id })
    }
  });
}

onShowStandSelection() {
  this.oDynamicDialogRef = this.oDialogService.open(AdminStandSelectionUnroutedComponent, {
    header: 'Selecciona un stand',
    width: '80%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true
  });
  

this.oDynamicDialogRef.onClose.subscribe((oStand: IStand) => {
  if (oStand) {
    this.oDetallePartida.stand = oStand;
    this.detallePartidaForm.controls['stand'].patchValue({ id: oStand.id })
  }
});
}

onShowPartidaSelection() {
  this.oDynamicDialogRef = this.oDialogService.open(AdminPartidaSelectionUnroutedComponent, {
    header: 'Selecciona una partida',
    width: '80%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true
  });
  

this.oDynamicDialogRef.onClose.subscribe((oPartida: IPartida) => {
  if (oPartida) {
    this.oDetallePartida.partida = oPartida;
    this.detallePartidaForm.controls['partida'].patchValue({ id: oPartida.id })
  }
});
}
}


