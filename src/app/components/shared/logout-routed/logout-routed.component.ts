import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';


@Component({
  selector: 'app-logout-routed',
  templateUrl: './logout-routed.component.html',
  styleUrls: ['./logout-routed.component.css']
})

export class LogoutRoutedComponent implements OnInit {

  constructor(
    private oSessionService: SessionAjaxService,
    private oMatSnackBar: MatSnackBar,
    private oRouter: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.oSessionService.logout();
    this.oSessionService.emit({ type: 'logout' });
    this.oMatSnackBar.open("Cierre de session exitoso.", '', { duration: 2000 });
    this.oRouter.navigate(['/home']);
  }

  cancel() {
    this.oRouter.navigate(['/home']);
  }

}