import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs/internal/Subject';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-admin-usuario-plist-routed',
  templateUrl: './admin-usuario-plist-routed.component.html',
  styleUrls: ['./admin-usuario-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminUsuarioPlistRoutedComponent implements OnInit {
  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;
  items: MenuItem[] | undefined;
  loadingProgress: number = 0;
  constructor( 

    private oUserAjaxService: UserAjaxService,
  private oConfirmationService: ConfirmationService,
  private oMatSnackBar: MatSnackBar,
  private MessageService: MessageService,
  
   ){}
  
 
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
        this.oUserAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Now there are ' + oResponse + ' users', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generating users: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }
  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Remove all users?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.oUserAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Now there are ' + oResponse + ' users', '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error emptying users: ' + oError.message, '', { duration: 2000 });
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