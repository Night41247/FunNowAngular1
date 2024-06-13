import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../service/comment.service';


@Component({
  selector: 'app-report-detail-dialog',
  templateUrl: './report-detail-dialog.component.html',
  styleUrls: ['./report-detail-dialog.component.css']
})
export class ReportDetailDialogComponent {

  constructor(public dialogRef: MatDialogRef<ReportDetailDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private commentService: CommentService)
  {
    console.log('Data received in dialog:', data); // 调试日志
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.onSubmit();
  }
  formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  onSubmit(): void {
    const reportReview = {
      commentID: this.data.commentID,
      memberID: this.data.memberID,
      reportTitleID: this.data.reportSubtitleID,
      reportSubtitleID: this.data.reportTitleID,
      reportedAt: this.formatDate(new Date()),
      reportReason: this.data.reportReason,
      reviewStatus: '1' // 示例值，根
    };

    console.log('Report Review Data:', reportReview); // 调试日志

    this.commentService.submitReport(reportReview).subscribe(
      response => {
        console.log('Report submitted successfully', response);
        this.dialogRef.close(true); // 关闭对话框并返回结果
      },
      error => {
        console.error('Error submitting report', error);
      }
    );
  }




}
