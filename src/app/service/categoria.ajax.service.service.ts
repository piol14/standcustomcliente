import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategoria, ICategoriaPage } from '../model/model.interfaces';
import { API_URL } from '../environment/environment';

@Injectable()
export class CategoriaAjaxService {

  private apiUrl: string = API_URL + '/categoria';

  constructor(private httpClient: HttpClient) {}

  getOne(id: number): Observable<ICategoria> {
    return this.httpClient.get<ICategoria>(`${this.apiUrl}/${id}`);
  }

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string): Observable<ICategoriaPage> {
    if (!size) size = 10;
    if (!page) page = 0;

    const url = `${this.apiUrl}?size=${size}&page=${page}&sort=${orderField},${orderDirection}`;
    return this.httpClient.get<ICategoriaPage>(url);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.httpClient.delete<number>(`${this.apiUrl}/${id}`);
    } else {
      return new Observable<number>();
    }
  }

  newOne(categoria: ICategoria): Observable<ICategoria> {
    return this.httpClient.post<ICategoria>(this.apiUrl, categoria);
  }

  updateOne(categoria: ICategoria): Observable<ICategoria> {
    return this.httpClient.put<ICategoria>(this.apiUrl, categoria);
  }

  generateRandom(amount: number): Observable<number> {
    return this.httpClient.post<number>(`${this.apiUrl}/populate/${amount}`, null);
  }

  empty(): Observable<number> {
    return this.httpClient.delete<number>(`${this.apiUrl}/empty`);
  }
}
