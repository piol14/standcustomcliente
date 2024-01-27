import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IDetallePartida } from 'src/app/model/model.interfaces';
import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';

@Component({
  selector: 'app-admin-detallePartida-detail-unrouted',
  templateUrl: './admin-detallePartida-detail-unrouted.component.html',
  styleUrls: ['./admin-detallePartida-detail-unrouted.component.css']
})
export class AdminDetallePartidaDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oUsuarioStand: IDetallePartida = {} as IDetallePartida;
  status: HttpErrorResponse | null = null;

  constructor(
    private oDetallePartidaAjaxService: DetallePartidaAjaxService,
    @Optional() public ref:DynamicDialogRef,
    @Optional() public config:DynamicDialogConfig
  ) {     
    if (config){
      if (config.data){
        this.id = config.data.id;
      }
    }    
  }

  ngOnInit() {
    console.log(this.id);
    this.getOne();
  }

  getOne(): void {
    this.oDetallePartidaAjaxService.getOne(this.id).subscribe({    
      next: (data: IDetallePartida) => {
        this.oUsuarioStand = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }
}