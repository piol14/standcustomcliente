import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFavorito,  IFavoritoPage } from '../model/model.interfaces';
import { API_URL } from '../environment/environment';

@Injectable()
export class FavoritoAjaxService {

  private apiUrl: string = API_URL + '/favorito';

  constructor(private httpClient: HttpClient) {}

  getOne(id: number): Observable<IFavorito> {
    return this.httpClient.get<IFavorito>(`${this.apiUrl}/${id}`);
  }

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<IFavoritoPage> {
    if (!size) size = 10;
    if (!page) page = 0;

    const url = `${this.apiUrl}?size=${size}&page=${page}&sort=${orderField},${orderDirection}`;
    return this.httpClient.get<IFavoritoPage>(url);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.httpClient.delete<number>(`${this.apiUrl}/${id}`);
    } else {
      return new Observable<number>();
    }
  }

  newOne(favorito: IFavorito): Observable<IFavorito> {
    return this.httpClient.post<IFavorito>(this.apiUrl, favorito);
  }

  updateOne(favorito: IFavorito): Observable<IFavorito> {
    return this.httpClient.put<IFavorito>(this.apiUrl,favorito);
  }

  generateRandom(amount: number): Observable<number> {
    return this.httpClient.post<number>(`${this.apiUrl}/populate/${amount}`, null);
  }

  empty(): Observable<number> {
    return this.httpClient.delete<number>(`${this.apiUrl}/empty`);
  }
}
