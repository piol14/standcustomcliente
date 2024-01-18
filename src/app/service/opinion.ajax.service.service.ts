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

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IOpinionPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        
        return this.httpClient.get<IOpinionPage>(`${this.apiUrl}?size=${size}&page=${page}&sort=${orderField},${orderDirection}`);
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

    // Puedes agregar métodos adicionales según sea necesario

}
