import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAtaqueStand, IAtaqueStandPage} from '../model/model.interfaces';
import { API_URL } from '../environment/environment';


@Injectable()
export class AtaqueStandAjaxService {

    sUrl: string = API_URL + "/ataques";

    constructor(
        private oHttpClient: HttpClient
    ) { }

    getOne(id: number): Observable<IAtaqueStand> {
        return this.oHttpClient.get<IAtaqueStand>(this.sUrl + "/" + id);
    }

  


    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IAtaqueStandPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        
        return this.oHttpClient.get<IAtaqueStandPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection);
    }
    

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.oHttpClient.delete<number>(this.sUrl + "/" + id);
        } else {
            return new Observable<number>();
        }
    }
     
    newOne(oUser: IAtaqueStand): Observable<IAtaqueStand> {
        return this.oHttpClient.post<IAtaqueStand>(this.sUrl, oUser);
    }

  

    updateOne(oUser: IAtaqueStand): Observable<IAtaqueStand> {
        return this.oHttpClient.put<IAtaqueStand>(this.sUrl, oUser);
    }

    generateRandom(amount: number): Observable<number> {
        return this.oHttpClient.post<number>(this.sUrl + "/populate/" + amount, null);
    }

   

    empty(): Observable<number> {
        return this.oHttpClient.delete<number>(this.sUrl + "/empty");
    }


}