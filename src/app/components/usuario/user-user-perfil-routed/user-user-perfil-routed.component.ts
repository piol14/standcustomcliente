import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-usuario-perfil-routed',
  templateUrl: './user-user-perfil-routed.component.html',
  styleUrls: ['./user-user-perfil-routed.component.css']
})
export class UserUserPerfilRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }
}
