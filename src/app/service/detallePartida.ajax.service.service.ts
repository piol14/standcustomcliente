import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDetallePartida, IDetallePartidaPage } from '../model/model.interfaces';
import { API_URL } from '../environment/environment';

@Injectable()
export class DetallePartidaAjaxService {

  private apiUrl: string = API_URL + '/detallePartida';

  constructor(private httpClient: HttpClient) {}
  getDetallePartidaPageByStand(standId: number, page: number, size: number, sort: string, direction: string): Observable<IDetallePartidaPage> {
    return this.httpClient.get<IDetallePartidaPage>(this.apiUrl + '/bystand/' + standId + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
}
getOpinionPageByUsuario(userId: number, page: number, size: number, sort: string, direction: string): Observable<IDetallePartidaPage> {
    return this.httpClient.get<IDetallePartidaPage>(this.apiUrl + '/byusuario/' + userId + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
}
  getOne(id: number): Observable<IDetallePartida> {
    return this.httpClient.get<IDetallePartida>(`${this.apiUrl}/${id}`);
  }

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_usuario: number , id_stand: number, id_partida:number): Observable<IDetallePartidaPage> {
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

    let strUrlpartida = "";
    if (id_partida > 0) {
      strUrlpartida = "&partida=" + id_partida;
    }
    return this.httpClient.get<IDetallePartidaPage>(this.apiUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlUser + strUrlstand  + strUrlpartida);
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
