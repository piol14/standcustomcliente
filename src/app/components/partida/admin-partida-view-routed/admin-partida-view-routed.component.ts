import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-partida-view-routed',
  templateUrl: './admin-partida-view-routed.component.html',
  styleUrls: ['./admin-partida-view-routed.component.css']
})
export class AdminPartidaViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
