import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDetallePartida, IDetallePartidaPage } from '../model/model.interfaces';
import { API_URL } from '../environment/environment';

@Injectable()
export class DetallePartidaAjaxService {

  private apiUrl: string = API_URL + '/usuarioStand';

  constructor(private httpClient: HttpClient) {}

  getOne(id: number): Observable<IDetallePartida> {
    return this.httpClient.get<IDetallePartida>(`${this.apiUrl}/${id}`);
  }

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IDetallePartidaPage> {
    if (!size) size = 10;
    if (!page) page = 0;

    const url = `${this.apiUrl}?size=${size}&page=${page}&sort=${orderField},${orderDirection}`;
    return this.httpClient.get<IDetallePartidaPage>(url);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.httpClient.delete<number>(`${this.apiUrl}/${id}`);
    } else {
      return new Observable<number>();
    }
  }

  newOne(detallePartida: IDetallePartida): Observable<IDetallePartida> {
    return this.httpClient.post<IDetallePartida>(this.apiUrl, detallePartida);
  }

  updateOne(detallePartida: IDetallePartida): Observable<IDetallePartida> {
    return this.httpClient.put<IDetallePartida>(this.apiUrl, detallePartida);
  }

  generateRandom(amount: number): Observable<number> {
    return this.httpClient.post<number>(`${this.apiUrl}/populate/${amount}`, null);
  }

  empty(): Observable<number> {
    return this.httpClient.delete<number>(`${this.apiUrl}/empty`);
  }
}
