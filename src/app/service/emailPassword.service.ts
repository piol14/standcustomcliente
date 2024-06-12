import { Observable } from 'rxjs';

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { EmailValuesDto } from '../model/model.emailDto';
import { ChangePasswordDto } from '../model/model.changePassword';
import { API_URL } from '../environment/environment';


@Injectable({
  providedIn: "root"
})

export class EmailPasswordService {  
    constructor(
        private oHttpClient: HttpClient
    ) { 

    }

    private apiUrl: string = API_URL + '/email';

    public sendEmail(oEmailValuesDto: EmailValuesDto): Observable<any>{
        return this.oHttpClient.post<any>(this.apiUrl + 'recover-password', oEmailValuesDto);
    }

    public changePassword(oEmailValuesDto: ChangePasswordDto): Observable<any>{
        return this.oHttpClient.post<any>(this.apiUrl + 'change-password', oEmailValuesDto);
    }

}