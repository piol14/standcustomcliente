import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-opinion-plist-routed',
  templateUrl: './admin-opinion-plist-routed.component.html',
  styleUrls: ['./admin-opinion-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminOpinionPlistRoutedComponent implements OnInit {

  bLoading = false;
  loadingProgress = 0;
  forceReload = new Subject<boolean>();
 id_usuario: number ;
  id_stand: number ;
  constructor(
    private ActivatedRoute: ActivatedRoute,
    private oOpinionAjaxService: OpinionAjaxService,
    private oMatSnackBar: MatSnackBar,
    private MessageService: MessageService,
    private oConfirmationService: ConfirmationService
  ) {
    this.id_usuario = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idusuario") ?? "0");
    this.id_stand= parseInt(this.ActivatedRoute.snapshot.paramMap.get("idstand") ?? "0");
    console.log(this.id_usuario);
  }

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
        this.oOpinionAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Now there are ' + oResponse + ' opinions', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generating opinions: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Borrar todas las opiniones?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.oOpinionAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Now there are ' + oResponse + ' opinions', '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error emptying opinions: ' + oError.message, '', { duration: 2000 });
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
