import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOpinion } from 'src/app/model/model.interfaces';
import { OpinionAjaxService } from 'src/app/service/opinion.ajax.service.service';

@Component({
  selector: 'app-admin-opinion-detail-unrouted',
  templateUrl: './admin-opinion-detail-unrouted.component.html',
  styleUrls: ['./admin-opinion-detail-unrouted.component.css']
})
export class AdminOpinionDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;

  oOpinion: IOpinion = {} as IOpinion;
  status: HttpErrorResponse | null = null;

  constructor(
    
    private oOpinionAjaxService: OpinionAjaxService,
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
    this.oOpinionAjaxService.getOne(this.id).subscribe({    
      next: (data: IOpinion) => {
        this.oOpinion = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }
}