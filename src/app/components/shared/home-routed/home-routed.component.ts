import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PaginatorState } from 'primeng/paginator';
import { Subject } from 'rxjs';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';

@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.css']
})
export class HomeRoutedComponent implements OnInit {
  forceReload = new Subject<boolean>();
  oPage: any = [];
  orderField: string = "id";
  orderDirection: string = "asc";
  oPaginatorState: PaginatorState = { first: 0, rows: 10, page: 0, pageCount: 0 };
  status: HttpErrorResponse | null = null;
  strUserName: string = "";
  constructor(
    
    private sessionService: SessionAjaxService
  ) { }

  ngOnInit() {
   
    this.strUserName = this.sessionService.getUsername();
  }

}
