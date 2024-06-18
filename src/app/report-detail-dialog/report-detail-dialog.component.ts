import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../service/comment.service';


@Component({
  selector: 'app-report-detail-dialog',
  templateUrl: './report-detail-dialog.component.html',
  styleUrls: ['./report-detail-dialog.component.css']
})
export class ReportDetailDialogComponent {

  reportReason: { commentTitle: string, commentText: string };
  constructor(
    public dialogRef: MatDialogRef<ReportDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commentService: CommentService)
  {this.reportReason = data.reportReason;
    console.log('Data received in dialog:', this.reportReason); // 调试日志


  }

  ChangeStatus(): void {
    // 调用服务来更新状态

    this.commentService.updateCommentAndReportStatus(this.data.commentId, this.data.reportId, 4).subscribe(
      (updatedReport: any) => {
        if (updatedReport) {
          console.log('Comment and report status updated:', updatedReport);
          // 调用发送电子邮件的服务
          this.sendEmail('5525asd9896@gmail.com', 'FunNow評論審核結果通知', `評論未通過審核，請遵守我們的評論規範。`);
          this.dialogRef.close(true);
        } else {
          console.error('Failed to update the status.');
          this.dialogRef.close(false);
        }
      },
      error => {
        console.error('Error updating status:', error);
        this.sendEmail('5525asd9896@gmail.com', 'FunNow評論審核結果通知', `評論未通過審核，請遵守我們的評論規範。`);
        this.dialogRef.close(false);

      }
    );
  }

  sendEmail(email: string, subject: string, body: string): void {
    this.commentService.sendEmail(email, subject, body).subscribe(

      response => {
        console.log('Email sent successfully:', response);
      },
      error => {
        console.error('Error sending email:', error);
      }
    );
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
