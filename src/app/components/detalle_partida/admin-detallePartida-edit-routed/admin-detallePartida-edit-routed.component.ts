import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-detallePartida-edit-routed',
  templateUrl: './admin-detallePartida-edit-routed.component.html',
  styleUrls: ['./admin-detallePartida-edit-routed.component.css']
})
export class AdminDetallePartidaEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }
}
