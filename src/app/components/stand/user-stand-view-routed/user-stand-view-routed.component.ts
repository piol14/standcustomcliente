import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-stand-view-routed',
  templateUrl: './user-stand-view-routed.component.html',
  styleUrls: ['./user-stand-view-routed.component.css']
})
export class UserStandViewRoutedComponent implements OnInit {

  id: number = 1;
  forceReload: Subject<boolean> = new Subject<boolean>();
  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }

  ngOnInit() {
  }

}
