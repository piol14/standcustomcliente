import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MessageService } from 'primeng/api'; // Ajusta la ruta del servicio
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AtaqueStandAjaxService } from 'src/app/service/ataqueStand.ajax.service.service';

@Component({
  selector: 'app-admin-ataqueStand-plist-routed',
  templateUrl: './admin-ataqueStand-plist-routed.component.html',
  styleUrls: ['./admin-ataqueStand-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminAtaqueStandPlistRoutedComponent implements OnInit {

  bLoading = false;
  loadingProgress = 0;
  forceReload = new Subject<boolean>();

  constructor(
    private oAtaqueStandAjaxService: AtaqueStandAjaxService,
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
        this.oAtaqueStandAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Now there are ' + oResponse + ' ataqueStands', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generating ataqueStands: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Remove all ataqueStands?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.oAtaqueStandAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Now there are ' + oResponse + ' ataqueStands', '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error emptying ataqueStands: ' + oError.message, '', { duration: 2000 });
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
