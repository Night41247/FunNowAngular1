import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-detail-dialog',
  templateUrl: './report-detail-dialog.component.html',
  styleUrls: ['./report-detail-dialog.component.css']
})
export class ReportDetailDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
