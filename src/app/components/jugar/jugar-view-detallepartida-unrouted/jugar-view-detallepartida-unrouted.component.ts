import { Component, Input, OnInit, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DetallePartidaAjaxService } from 'src/app/service/detallePartida.ajax.service.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IDetallePartida } from 'src/app/model/model.interfaces';


interface AguanteMap {
  [key: string]: number;
}
interface AciertoMap {
  [key: string]: number;
}

@Component({
  selector: 'app-jugar-view-detallepartida-unrouted',
  templateUrl: './jugar-view-detallepartida-unrouted.component.html',
  styleUrls: ['./jugar-view-detallepartida-unrouted.component.css']
})
export class JugarViewDetallepartidaUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  oDetallePartida: IDetallePartida = {} as IDetallePartida;
  status: HttpErrorResponse | null = null;


  aguanteMap: AguanteMap = {
    'A':1000,
    'B':800,
    'C':500,
    'D': 300,
   
  };
  aciertoMap: AciertoMap = {
    'A':90,
    'B':70,
    'C':50,
    'D': 30,
   
  };

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


  getAguanteNumerico(aguante: string): number {
    return this.aguanteMap[aguante] || 0; 
  }

  getOne(): void {
    this.oDetallePartidaAjaxService.getOne(this.id).subscribe({    
      next: (data: IDetallePartida) => {
        this.oDetallePartida = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }

    })

  }
}
