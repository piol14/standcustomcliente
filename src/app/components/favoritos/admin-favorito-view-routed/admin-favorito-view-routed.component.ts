import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-favorito-view-routed',
  templateUrl: './admin-favorito-view-routed.component.html',
  styleUrls: ['./admin-favorito-view-routed.component.css']
})
export class AdminFavoritoViewRoutedComponent implements OnInit {
  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
