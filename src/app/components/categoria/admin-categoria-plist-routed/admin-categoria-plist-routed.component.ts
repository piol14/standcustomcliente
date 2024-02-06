import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';

@Component({
  selector: 'app-admin-categoria-plist-routed',
  templateUrl: './admin-categoria-plist-routed.component.html',
  styleUrls: ['./admin-categoria-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminCategoriaPlistRoutedComponent implements OnInit {

 
  bLoading = false;
  loadingProgress = 0;
  forceReload = new Subject<boolean>();

  constructor(
    private oCategoriaAjaxService: CategoriaAjaxService,
    private oMatSnackBar: MatSnackBar,
    private MessageService: MessageService,
    private oConfirmationService: ConfirmationService
  ) {}

  ngOnInit() {}

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    const totalSteps = 10;
    const stepSize = 100 / totalSteps;
    this.loadingProgress = 0;

    const intervalId = setInterval(() => {
      if (this.loadingProgress < 100) {
        this.loadingProgress += stepSize;
      } else {
        clearInterval(intervalId);
        this.oCategoriaAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Ahora hay ' + oResponse + ' categorias', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generando categorias: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Borrar  todas las categorias?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.oCategoriaAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Ahora hay   ' + oResponse + ' categorias', '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error vaciando las categorias: ' + oError.message, '', { duration: 2000 });
            this.bLoading = false;
          },
        });
      },
      reject: () => {
        this.oMatSnackBar.open('Vaciado cancelado!', '', { duration: 2000 });
      }
    });
  }
}



