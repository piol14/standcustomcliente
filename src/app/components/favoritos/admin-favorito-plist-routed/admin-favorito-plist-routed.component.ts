import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { FavoritoAjaxService } from 'src/app/service/favorito.ajax.service.service';

@Component({
  selector: 'app-admin-favorito-plist-routed',
  templateUrl: './admin-favorito-plist-routed.component.html',
  styleUrls: ['./admin-favorito-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]

})
export class AdminFavoritoPlistRoutedComponent implements OnInit {
  id_usuario: number=0 ;
  id_stand: number = 0;
  bLoading = false;
  loadingProgress = 0;
  forceReload = new Subject<boolean>();

  constructor(
    private oFavoritoAjaxService: FavoritoAjaxService,
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
        this.oFavoritoAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Ahora hay ' + oResponse + ' favoritos', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generando favoritos: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Borrar  todos los favoritos?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => {
        this.oFavoritoAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Ahora hay   ' + oResponse + ' favoritos', '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error vaciando los favoritos: ' + oError.message, '', { duration: 2000 });
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


