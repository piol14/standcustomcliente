import { HttpClient, HttpParams } from '@angular/common/http';
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
  getFavoritoPageByStand(standId: number, page: number, size: number, sort: string, direction: string): Observable<IFavoritoPage> {
    return this.httpClient.get<IFavoritoPage>(this.apiUrl + '/bystand/' + standId + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
}
getFavoritoPageByUsuario(userId: number, page: number, size: number, sort: string, direction: string): Observable<IFavoritoPage> {
    return this.httpClient.get<IFavoritoPage>(this.apiUrl + '/byusuario/' + userId + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
}
  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string,  id_usuario: number , id_stand: number): Observable<IFavoritoPage> {
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

        return this.httpClient.get<IFavoritoPage>(this.apiUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlUser + strUrlstand );
  
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

  verificarFavoritoRepetido(usuarioId: number, standId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}/repetido/${usuarioId}/${standId}`);
  }

  obtenerFavoritoRepetidoId(usuarioId: number, standId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.apiUrl}/repetido/${usuarioId}/${standId}/id`);
  }
}
