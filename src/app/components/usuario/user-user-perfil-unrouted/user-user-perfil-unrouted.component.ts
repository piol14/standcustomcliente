import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service.service';

@Component({
  selector: 'app-user-user-perfil-unrouted',
  templateUrl: './user-user-perfil-unrouted.component.html',
  styleUrls: ['./user-user-perfil-unrouted.component.css']
})
export class UserUserPerfilUnroutedComponent implements OnInit {

  strUserName: string = "";
  oSessionUser: IUser | null = null;
  strUrl: string = "";
  id: number;
  constructor(
    private oActivatedRoute: ActivatedRoute,
    private sesionService: SessionAjaxService,
    public oDialogService: DialogService,
    private usuarioService: UserAjaxService,
    private oRouter: Router
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
    
    this.oRouter.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.strUrl = ev.url;
      }
    });

    this.strUserName = this.sesionService.getUsername();
  }

  ngOnInit(): void {
    if (this.strUserName) {
      this.usuarioService.getByUsername(this.strUserName).subscribe({
        next: (oUser: IUser) => {
          this.oSessionUser = oUser;
          this.id = this.oSessionUser.id;  // Asignar la ID del usuario autenticado
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      });
    } else {
      console.log('No hay usuario autenticado');
      // Aquí puedes manejar la lógica para cuando no hay usuario autenticado.
      // Por ejemplo, redirigir al usuario a la página de inicio de sesión.
    }
  }
}



