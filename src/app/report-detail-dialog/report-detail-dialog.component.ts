import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-report-detail-dialog',
  template: `
    <h1 mat-dialog-title>內容</h1>
    <div mat-dialog-content>
      <p>{{ data.reportReason }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>關閉</button>
    </div>
  `,
  styleUrls: ['./report-detail-dialog.component.css']
})
export class ReportDetailDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
