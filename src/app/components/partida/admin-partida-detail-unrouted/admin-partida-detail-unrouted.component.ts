import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IPartida } from 'src/app/model/model.interfaces';
import { PartidaAjaxService } from 'src/app/service/partida.ajax.service.service';

@Component({
  selector: 'app-admin-partida-detail-unrouted',
  templateUrl: './admin-partida-detail-unrouted.component.html',
  styleUrls: ['./admin-partida-detail-unrouted.component.css']
})
export class AdminPartidaDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  oPartida: IPartida = {} as IPartida;
  status: HttpErrorResponse | null = null;
  constructor(
  private oPartidaAjaxService: PartidaAjaxService,
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
  this.oPartidaAjaxService.getOne(this.id).subscribe({    
    next: (data: IPartida) => {
      this.oPartida = data;
    },
    error: (error: HttpErrorResponse) => {
      this.status = error;
    }

  })

}
}