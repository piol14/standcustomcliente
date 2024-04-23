import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IFavorito } from 'src/app/model/model.interfaces';

import { FavoritoAjaxService } from 'src/app/service/favorito.ajax.service.service'; // Corregido el import

@Component({
  selector: 'app-admin-favorito-detail-unrouted',
  templateUrl: './admin-favorito-detail-unrouted.component.html',
  styleUrls: ['./admin-favorito-detail-unrouted.component.css']
})
export class AdminFavoritoDetailUnroutedComponent implements OnInit {
  @Input() id: number = 1;
  
  oFavorito: IFavorito = {} as IFavorito;
  status: HttpErrorResponse | null = null;
  constructor(
    private oFavoritoAjaxService: FavoritoAjaxService, // Corregido el servicio inyectado
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
    this.oFavoritoAjaxService.getOne(this.id).subscribe({    
      next: (data: IFavorito) => {
        this.oFavorito = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }
}
