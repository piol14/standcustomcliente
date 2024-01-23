import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-opinion-view-routed',
  templateUrl: './admin-opinion-view-routed.component.html',
  styleUrls: ['./admin-opinion-view-routed.component.css']
})
export class AdminOpinionViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }




}
