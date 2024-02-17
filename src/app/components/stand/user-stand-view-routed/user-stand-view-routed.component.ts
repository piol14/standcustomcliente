import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-user-stand-view-routed',
  templateUrl: './user-stand-view-routed.component.html',
  styleUrls: ['./user-stand-view-routed.component.css'],
  providers: [ ConfirmationService]
})
export class UserStandViewRoutedComponent implements OnInit {

  id: number = 1;
  forceReload: Subject<boolean> = new Subject<boolean>();
  constructor(
    private confirmationService: ConfirmationService,
   
    private DialogService: DialogService,
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");

  }

  ngOnInit() {
  }

}
