import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPartida, IPartidaPage } from '../model/model.interfaces';
import { API_URL } from '../environment/environment';

@Injectable()
export class PartidaAjaxService {

    private apiUrl: string = API_URL + "/partida";

    constructor(
        private httpClient: HttpClient
    ) { }

    getOne(id: number): Observable<IPartida> {
        return this.httpClient.get<IPartida>(`${this.apiUrl}/${id}`);
    }

    getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IPartidaPage> {
        if (!size) size = 10;
        if (!page) page = 0;
        
        return this.httpClient.get<IPartidaPage>(`${this.apiUrl}?size=${size}&page=${page}&sort=${orderField},${orderDirection}`);
    }

    removeOne(id: number | undefined): Observable<number> {
        if (id) {
            return this.httpClient.delete<number>(`${this.apiUrl}/${id}`);
        } else {
            return new Observable<number>();
        }
    }

    newOne(Partida: IPartida): Observable<IPartida> {
        return this.httpClient.post<IPartida>(this.apiUrl, Partida);
    }

    updateOne(Partida: IPartida): Observable<IPartida> {
        return this.httpClient.put<IPartida>(this.apiUrl, Partida);
    }

    empty(): Observable<number> {
        return this.httpClient.delete<number>(`${this.apiUrl}/empty`);
    }


    generateRandom(amount: number): Observable<number> {
        return this.httpClient.post<number>(`${this.apiUrl}/populate/${amount}`, null);
    }
  

}
