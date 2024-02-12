import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStand, IStandPage} from '../model/model.interfaces';
import { API_URL } from '../environment/environment';


@Injectable()
export class StandAjaxService {

    sUrl: string = API_URL + "/stand";

    constructor(
        private oHttpClient: HttpClient
    ) { }

    getOne(id: number): Observable<IStand> {
        return this.oHttpClient.get<IStand>(this.sUrl + "/" + id);
    }

  


    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_usuario: number , id_categoria:number): Observable<IStandPage> {
        let strUrlUser = "";
        let strUrlCategoria = "";
        if (!size) size = 10;
        if (!page) page = 0;
        if (id_usuario > 0) {
            strUrlUser = "&usuario=" + id_usuario;
        }
        if (id_categoria > 0) {
            strUrlUser = "&categoria=" + id_categoria;
        }
        return this.oHttpClient.get<IStandPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection+ strUrlUser + strUrlCategoria) ;
    }
    

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
        } else {
            return new Observable<number>();
        }
    }
     
    newOne(oUser: IStand): Observable<IStand> {
        return this.oHttpClient.post<IStand>(this.sUrl, oUser);
    }

  

    updateOne(oUser: IStand): Observable<IStand> {
        return this.oHttpClient.put<IStand>(this.sUrl, oUser);
    }

    generateRandom(amount: number): Observable<number> {
        return this.oHttpClient.post<number>(this.sUrl + "/populate/" + amount, null);
    }

   

    empty(): Observable<number> {
        return this.oHttpClient.delete<number>(this.sUrl + "/empty");
    }


}