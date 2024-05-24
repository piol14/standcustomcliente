import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmationService, MessageService } from 'primeng/api'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-stand-plist-routed',
  templateUrl: './admin-stand-plist-routed.component.html',
  styleUrls: ['./admin-stand-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminStandPlistRoutedComponent implements OnInit {
  id_usuario: number ;
  id_categoria: number = 0;
  bLoading = false;
  loadingProgress = 0;
  forceReload = new Subject<boolean>();

  constructor(
    private ActivatedRoute: ActivatedRoute,
    private oStandAjaxService: StandAjaxService,
    private oMatSnackBar: MatSnackBar,
    private MessageService: MessageService,
    private oConfirmationService: ConfirmationService
  ) {
    this.id_usuario = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idusuario") ?? "0");
    this.id_categoria = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idcategoria") ?? "0");
  }

  ngOnInit() {
  }

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
        this.oStandAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Now there are ' + oResponse + ' stands', life: 2000 });
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generating stands: ' + oError.message, life: 2000 });
          },
          complete: () => {
            this.bLoading = false;
            
            this.loadingProgress = 0;
          }
        });
      }
    }, 1000 / totalSteps);
  }
  
  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Borrar todos los stands?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.oStandAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Now there are ' + oResponse + ' stands', '', { duration: 2000 });
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error emptying stands: ' + oError.message, '', { duration: 2000 });
          },
          complete: () => {
            this.bLoading = false;
          }
        });
      },
      reject: () => {
        this.oMatSnackBar.open('Empty cancelled!', '', { duration: 2000 });
      }
    });
  }
  
}
