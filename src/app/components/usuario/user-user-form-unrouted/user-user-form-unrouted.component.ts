import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { formOperation, IUser } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-user-user-form-unrouted',
  templateUrl: './user-user-form-unrouted.component.html',
  styleUrls: ['./user-user-form-unrouted.component.css']
})
export class UserUserFormUnroutedComponent implements OnInit {

 
    @Input() id: number = 1;
    @Input() operation: 'EDIT' | 'NEW' = 'EDIT';
    userForm!: FormGroup;
    oUser: IUser = {} as IUser;
    status: HttpErrorResponse | null = null;
    isSubmitting: boolean = false;
    strUserName: string = "";
    oSessionUser: IUser | null = null;
  
    constructor(
      private sessionService: SessionAjaxService,
      private dialogService: DialogService,
      private userService: UserAjaxService,
      private formBuilder: FormBuilder,
      private router: Router,
      private snackBar: MatSnackBar,
      private activatedRoute: ActivatedRoute,
      @Optional() public ref: DynamicDialogRef,
      @Optional() public config: DynamicDialogConfig
    ) {
      if (config && config.data && config.data.usuario) {
        this.oUser = config.data.usuario;
      }
      this.initializeForm(this.oUser);
    }
  
    ngOnInit(): void {
      this.getSessionUser();
    }
  
    getSessionUser(): void {
      this.strUserName = this.sessionService.getUsername();
      if (this.strUserName) {
        this.userService.getByUsername(this.strUserName).subscribe({
          next: (oUser: IUser) => {
            this.oSessionUser = oUser;
            this.id = this.oSessionUser.id; // Asignar la ID del usuario autenticado
            if (this.operation === 'EDIT') {
              this.getOne();
            }
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.snackBar.open('Error al obtener el usuario autenticado', '', { duration: 2000 });
          }
        });
      } else {
        console.log('No hay usuario autenticado');
        this.router.navigate(['/login']);
      }
    }
  
    getOne(): void {
      this.userService.getOne(this.id).subscribe({
        next: (data: IUser) => {
          this.oUser = data;
          this.initializeForm(this.oUser);
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.snackBar.open('Error al leer el usuario del servidor', '', { duration: 2000 });
        }
      });
    }
  
    initializeForm(oUser: IUser): void {
      this.userForm = this.formBuilder.group({
        id: [{ value: oUser.id, disabled: this.operation === 'NEW' }, Validators.required],
        nombre: [oUser.nombre, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
        telefono: [oUser.telefono, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
        email: [oUser.email, [Validators.required, Validators.email]],
        role: [oUser.role?.toString() || '', Validators.required],
        username: [oUser.username]
      });
    }
  
    hasError(controlName: string, errorName: string): boolean {
      return this.userForm.controls[controlName].hasError(errorName);
    }
  
    onSubmit(): void {
      if (this.userForm.valid && !this.isSubmitting) {
        this.isSubmitting = true;
        const formValue = this.userForm.getRawValue();
  
        if (this.operation === 'EDIT') {
          this.userService.updateOne(formValue).subscribe({
            next: (data: IUser) => {
              this.oUser = data;
              this.snackBar.open('El usuario se ha actualizado correctamente', '', { duration: 2000 });
              if (this.ref) {
                this.ref.close(data);
              }
              this.router.navigate(['/perfil']);
              this.isSubmitting = false;
            },
            error: (error: HttpErrorResponse) => {
              this.status = error;
              this.snackBar.open('Error al actualizar el usuario', '', { duration: 2000 });
              this.isSubmitting = false;
            }
          });
        } else {
          this.userService.newOne(formValue).subscribe({
            next: (data: IUser) => {
              this.oUser = data;
              this.snackBar.open('El usuario se ha creado correctamente', '', { duration: 2000 });
              this.router.navigate(['/perfil']);
              this.isSubmitting = false;
            },
            error: (error: HttpErrorResponse) => {
              this.status = error;
              this.snackBar.open('Error al crear el usuario', '', { duration: 2000 });
              this.isSubmitting = false;
            }
          });
        }
      }
    }
  }
  
