import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-favorito-edit-routed',
  templateUrl: './admin-favorito-edit-routed.component.html',
  styleUrls: ['./admin-favorito-edit-routed.component.css']
})
export class AdminFavoritoEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
