import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-stand-edit-routed',
  templateUrl: './admin-stand-edit-routed.component.html',
  styleUrls: ['./admin-stand-edit-routed.component.css']
})
export class AdminStandEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}
