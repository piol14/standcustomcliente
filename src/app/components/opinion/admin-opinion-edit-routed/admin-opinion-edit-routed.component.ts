import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-opinion-edit-routed',
  templateUrl: './admin-opinion-edit-routed.component.html',
  styleUrls: ['./admin-opinion-edit-routed.component.css']
})
export class AdminOpinionEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }
}
