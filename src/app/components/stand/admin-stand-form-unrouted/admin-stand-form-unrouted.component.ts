import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IStand, IUser, formOperation } from 'src/app/model/model.interfaces'; 
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MediaService } from 'src/app/service/media.service';
import { AdminUsuarioSelectionUnroutedComponent } from '../../usuario/admin-usuario-selection-unrouted/admin-usuario-selection-unrouted.component';
import { AdminCategoriaSelectionUnroutedComponent } from '../../categoria/admin-categoria-selection-unrouted/admin-categoria-selection-unrouted.component';

@Component({
  selector: 'app-admin-stand-form-unrouted',
  templateUrl: './admin-stand-form-unrouted.component.html',
  styleUrls: ['./admin-stand-form-unrouted.component.css']
})
export class AdminStandFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';
  selectedImageUrl: string | undefined;
  standForm!: FormGroup;
  oStand: IStand = {} as IStand;
  status: HttpErrorResponse | null = null;
  oDynamicDialogRef: DynamicDialogRef | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private standService: StandAjaxService, 
    private router: Router,
    private snackBar: MatSnackBar,
    public oDialogService: DialogService,
    private MediaService: MediaService
  ) {
    this.initializeForm(this.oStand);
  }

  initializeForm(oStand: IStand) {
    this.standForm = this.formBuilder.group({
      id: [oStand.id],
      nombre: [oStand.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      descripcion: [oStand.descripcion, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      velocidad: [oStand.velocidad || 'D'],
      alcance: [oStand.alcance || 'D'],     
      poder: [oStand.poder || 'D'],         
      aguante: [oStand.aguante || 'D'],  
      acierto: [oStand.acierto || 'D'],  
      imagen: [oStand.imagen, Validators.required],
     desarollo: [oStand.desarollo || 'D'],
     usuario:this.formBuilder.group({
      id: [oStand.usuario?.id, Validators.required],
    }),
    categoria:this.formBuilder.group({
      id: [oStand.categoria?.id, Validators.required],
    }),
  
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
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      this.MediaService.uploadFile(formData).subscribe({
        next: (response) => {
          this.selectedImageUrl = response.url; 
          this.oStand.imagen = response.url;
          this.standForm.controls['imagen'].patchValue(response.url);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error al subir la imagen', '', { duration: 2000 });
        }
      });
}
  }
  onShowUsuarioSelection() {
    this.oDynamicDialogRef = this.oDialogService.open(AdminUsuarioSelectionUnroutedComponent, {
      header: 'Select a User', 
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });
  
  this.oDynamicDialogRef.onClose.subscribe((oUser: IUser) => {
    if (oUser) {
      this.oStand.usuario = oUser;
      this.standForm.controls['usuario'].patchValue({ id: oUser.id })
    }
  });
}
onShowCategoriaSelection() {
  this.oDynamicDialogRef = this.oDialogService.open(AdminCategoriaSelectionUnroutedComponent, {
    header: 'Seleccionar una Categoría',
    width: '80%',
    contentStyle: { overflow: 'auto' },
    baseZIndex: 10000,
    maximizable: true
  });

  this.oDynamicDialogRef.onClose.subscribe((categoria: any) => {
    if (categoria) {
      this.oStand.categoria = categoria;
      this.standForm.controls['categoria'].patchValue({ id: categoria.id });
    }
  });
}

}