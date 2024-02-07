import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOpinion, IOpinionPage } from '../model/model.interfaces';
import { API_URL } from '../environment/environment';

@Injectable()
export class OpinionAjaxService {

    private apiUrl: string = API_URL + "/opinion";

    constructor(
        private httpClient: HttpClient
    ) { }

    getOne(id: number): Observable<IOpinion> {
        return this.httpClient.get<IOpinion>(`${this.apiUrl}/${id}`);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_usuario: number , id_stand: number): Observable<IOpinionPage> {
      
        let strUrlUser = "";
        if (!size) size = 10;
        if (!page) page = 0;
        if (id_usuario > 0) {
            strUrlUser = "&usuario=" + id_usuario;
        }
    
        let strUrlstand = "";
        if (id_stand > 0) {
          strUrlstand = "&stand=" + id_stand;
        }
        return this.httpClient.get<IOpinionPage>(this.apiUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlUser + strUrlstand );
    }

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.httpClient.delete<number>(`${this.apiUrl}/${id}`);
        } else {
            return new Observable<number>();
        }
    }

    newOne(opinion: IOpinion): Observable<IOpinion> {
        return this.httpClient.post<IOpinion>(this.apiUrl, opinion);
    }

    updateOne(opinion: IOpinion): Observable<IOpinion> {
        return this.httpClient.put<IOpinion>(this.apiUrl, opinion);
    }

    //el empty
    empty(): Observable<number> {
        return this.httpClient.delete<number>(`${this.apiUrl}/empty`);
    }
    //generateRandom
    generateRandom(amount: number): Observable<number> {
        return this.httpClient.post<number>(`${this.apiUrl}/populate/${amount}`, null);
    }
    // Puedes agregar métodos adicionales según sea necesario

}
