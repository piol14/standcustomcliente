
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MessageService } from 'primeng/api'; // Ajusta la ruta del servicio
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';

@Component({
  selector: 'app-admin-detallePartida-plist-routed',
  templateUrl: './admin-detallePartida-plist-routed.component.html',
  styleUrls: ['./admin-detallePartida-plist-routed.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class AdminDetallePartidaPlistRoutedComponent implements OnInit {

  bLoading = false;
  loadingProgress = 0;
  forceReload = new Subject<boolean>();
  id_usuario: number ;
  id_stand: number ;
  id_partida: number;
  constructor(
    private oDetallePartidaAjaxService: DetallePartidaAjaxService,
    private oMatSnackBar: MatSnackBar,
    private MessageService: MessageService,
    private oConfirmationService: ConfirmationService,
    private ActivatedRoute: ActivatedRoute,
  ) {  this.id_usuario = parseInt(this.ActivatedRoute.snapshot.paramMap.get("idusuario") ?? "0");
  this.id_stand= parseInt(this.ActivatedRoute.snapshot.paramMap.get("idstand") ?? "0");4
  this.id_partida= parseInt(this.ActivatedRoute.snapshot.paramMap.get("idpartida") ?? "0");}


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
        this.oDetallePartidaAjaxService.generateRandom(amount).subscribe({
          next: (oResponse: number) => {
            this.MessageService.add({ severity: 'success', detail: 'Now there are ' + oResponse + ' detallePartidas', life: 2000 });
            this.bLoading = false;
          },
          error: (oError: HttpErrorResponse) => {
            this.MessageService.add({ severity: 'error', detail: 'Error generating detallePartidas: ' + oError.message, life: 2000 });
            this.bLoading = false;
          }
        });
      }
    }, 1000 / totalSteps);
  }

  doEmpty($event: Event) {
    this.oConfirmationService.confirm({
      target: $event.target as EventTarget,
      message: 'Borrar todos los detallePartidas?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.oDetallePartidaAjaxService.empty().subscribe({
          next: (oResponse: number) => {
            this.oMatSnackBar.open('Now there are ' + oResponse + ' detallePartidas', '', { duration: 2000 });
            this.bLoading = false;
            this.forceReload.next(true);
          },
          error: (oError: HttpErrorResponse) => {
            this.oMatSnackBar.open('Error emptying detallePartidas: ' + oError.message, '', { duration: 2000 });
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
