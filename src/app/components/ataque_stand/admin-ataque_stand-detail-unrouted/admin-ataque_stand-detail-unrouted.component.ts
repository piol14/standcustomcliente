import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IAtaqueStand, IStand } from 'src/app/model/model.interfaces';
import { AtaqueStandAjaxService } from 'src/app/service/ataqueStand.ajax.service.service';

@Component({
  selector: 'app-admin-ataque_stand-detail-unrouted',
  templateUrl: './admin-ataque_stand-detail-unrouted.component.html',
  styleUrls: ['./admin-ataque_stand-detail-unrouted.component.css']
})
export class AdminAtaqueStandDetailUnroutedComponent implements OnInit {

  
  @Input() id: number = 1;

  oAtaque:  IAtaqueStand = {} as IAtaqueStand;
  status: HttpErrorResponse | null = null;

  constructor(
    private oAtaqueStandAjaxService: AtaqueStandAjaxService,
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
    this.oAtaqueStandAjaxService.getOne(this.id).subscribe({    
      next: (data: IAtaqueStand) => {
        this.oAtaque = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

}