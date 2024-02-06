


  import { HttpErrorResponse } from '@angular/common/http';
  import { Component, Input, OnInit, Optional } from '@angular/core';
  import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
  import { ICategoria, ICategoriaPage,  } from 'src/app/model/model.interfaces';
import { CategoriaAjaxService } from 'src/app/service/categoria.ajax.service.service';
  
  
  @Component({
    selector: 'app-admin-categoria-detail-unrouted',
    templateUrl: './admin-categoria-detail-unrouted.component.html',
    styleUrls: ['./admin-categoria-detail-unrouted.component.css']
  })
  export class AdminCategoriaDetailUnroutedComponent implements OnInit {
    @Input() id: number = 1;
  
    oCategoria: ICategoria = {} as ICategoria;
    status: HttpErrorResponse | null = null;
    constructor(
    private oCategoriaAjaxService: CategoriaAjaxService,
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
    this.oCategoriaAjaxService.getOne(this.id).subscribe({    
      next: (data: ICategoria) => {
        this.oCategoria = data
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
  
    })
  
  }
  }

