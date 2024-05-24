import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { PartidaAjaxService } from 'src/app/service/partida.ajax.service.service';

@Component({
  selector: 'app-admin-partida-plist-routed',
  templateUrl: './admin-partida-plist-routed.component.html',
  styleUrls: ['./admin-partida-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminPartidaPlistRoutedComponent implements OnInit {

  bLoading = false;
  loadingProgress = 0;
  forceReload = new Subject<boolean>();

  constructor(
    private oPartidaAjaxService: PartidaAjaxService,
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
        this.oPartidaAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Now there are ' + oResponse + ' partidas', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generating partidas: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Borrar todas las partidas?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.oPartidaAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Now there are ' + oResponse + ' partidas', '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error emptying partidas: ' + oError.message, '', { duration: 2000 });
            this.bLoading = false;
          },
        });
      },
      reject: () => {
        this.oMatSnackBar.open('Empty cancelled!', '', { duration: 2000 });
      }
    });
  }
}
