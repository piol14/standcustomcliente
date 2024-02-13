import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IStand } from 'src/app/model/model.interfaces';
import { StandAjaxService } from 'src/app/service/stand.ajax.service.service';

@Component({
  selector: 'app-user-stand-detail-unrouted',
  templateUrl: './user-stand-detail-unrouted.component.html',
  styleUrls: ['./user-stand-detail-unrouted.component.css']
})
export class UserStandDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oStand: IStand = {} as IStand;
  status: HttpErrorResponse | null = null;

  constructor(
    private oStandAjaxService: StandAjaxService,
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
    this.oStandAjaxService.getOne(this.id).subscribe({    
      next: (data: IStand) => {
        this.oStand = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }

}
