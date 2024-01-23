import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-detallePartida-view-routed',
  templateUrl: './admin-detallePartida-view-routed.component.html',
  styleUrls: ['./admin-detallePartida-view-routed.component.css']
})
export class AdminDetallePartidaViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
