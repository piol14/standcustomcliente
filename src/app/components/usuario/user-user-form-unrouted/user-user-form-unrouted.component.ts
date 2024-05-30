import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { formOperation, IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-user-user-form-unrouted',
  templateUrl: './user-user-form-unrouted.component.html',
  styleUrls: ['./user-user-form-unrouted.component.css']
})
export class UserUserFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'EDIT';

  userForm!: FormGroup;
  oUser: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;
  isSubmitting: boolean = false;

  constructor(
    private oFormBuilder: FormBuilder,
    private oUserAjaxService: UserAjaxService,
    private oRouter: Router,
    private oMatSnackBar: MatSnackBar,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config && config.data && config.data.usuario) {
      this.oUser = config.data.usuario;
    }
    this.initializeForm(this.oUser);
  }
  

  initializeForm(oUser: IUser) {
    this.userForm = this.oFormBuilder.group({
      id: [{ value: oUser.id, disabled: this.operation === 'NEW' }, Validators.required],
      nombre: [oUser.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      telefono: [oUser.telefono, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: [oUser.email, [Validators.required, Validators.email]],
      username: [oUser.username, [Validators.required, Validators.minLength(6), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]+$')]],
      role: [oUser.role?.toString() || '', Validators.required]
    });
  }

  ngOnInit() {
    if (this.operation === 'EDIT') {
      this.oUserAjaxService.getOne(this.id).subscribe({
        next: (data: IUser) => {
          this.oUser = data;
          this.initializeForm(this.oUser);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.oMatSnackBar.open('Error al leer el usuario del servidor', '', { duration: 2000 });
        }
      });
    } else {
      this.initializeForm(this.oUser);
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.userForm.getRawValue(); // Para incluir controles deshabilitados

      if (this.operation === 'EDIT') {
        this.oUserAjaxService.updateOne(formValue).subscribe({
          next: (data: IUser) => {
            this.oUser = data;
            this.oMatSnackBar.open('El usuario se ha actualizado correctamente', '', { duration: 2000 });
            if (this.ref) {
              this.ref.close(data);
            }
            this.oRouter.navigate(['/perfil']);
            this.isSubmitting = false;
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al actualizar el usuario', '', { duration: 2000 });
            this.isSubmitting = false;
          }
        });
      } else {
        this.oUserAjaxService.newOne(formValue).subscribe({
          next: (data: IUser) => {
            this.oUser = data;
            this.oMatSnackBar.open('El usuario se ha creado correctamente', '', { duration: 2000 });
            this.oRouter.navigate(['/perfil']);
            this.isSubmitting = false;
          },
          error: (error: HttpErrorResponse) => {
            this.status = error;
            this.oMatSnackBar.open('Error al crear el usuario', '', { duration: 2000 });
            this.isSubmitting = false;
          }
        });
      }
    }
  }
}
