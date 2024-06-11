
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../service/comment.service';
import { ReportDetailDialogComponent } from '../report-detail-dialog/report-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';



interface Title {
  value: string;
  viewValue: string;
}

interface Subtitle {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-reportform',
  templateUrl: './reportform.component.html',
  styleUrls: ['./reportform.component.css']
})
export class ReportformComponent {
  constructor(private route: ActivatedRoute,private http: HttpClient,private commentService: CommentService,private dialog: MatDialog) {}

  selectedSubtitles: Subtitle[] = [];
  selectedSubtitle: string = '';
  selectedTitle: string = '';

  titles: Title[] = [
    { value: '1', viewValue: '訂單相關' },
    { value: '2', viewValue: '財務與帳單' },
    { value: '3', viewValue: '商務與產品相關' },
    { value: '4', viewValue: '加入FunNow或終止合約' }
  ];

  ordersubtitles: Subtitle[] = [
    { value: '1', viewValue: '住客評語' },
    { value: '2', viewValue: '訂單相關' },
    { value: '3', viewValue: '顧客不當行為' }
  ];

  financesubtitles: Subtitle[] = [
    { value: '1', viewValue: '收費相關客訴' },
    { value: '2', viewValue: '佣金' },
    { value: '3', viewValue: '未付款導致暫時關閉' },
    { value: '4', viewValue: '延遲付款' },
    { value: '5', viewValue: '退款' }
  ];

  productsubtitles: Subtitle[] = [
    { value: '1', viewValue: '條款與條件' },
    { value: '2', viewValue: '商業表現' },
    { value: '3', viewValue: '錯誤或技術性問題' }
  ];

  contractsubtitles: Subtitle[] = [
    { value: '1', viewValue: '無法終止合約' },
    { value: '2', viewValue: '無法在FunNow接受預訂' },
    { value: '3', viewValue: '被FunNow終止合約' }
  ];

  memberName: string = '';
  memberEmail: string = '';
  commentFirstName: string = '';
  commentRoomTypeName: string = '';
  commentTravelerType: string = '';
  commentTitle: string = '';
  commentText: string = '';
  commentCreatedAt: string = '';
  reportReason: string = '';
  commentID: number = 0;
  memberID: number = 0;

  commentData: any = {};

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Received queryParams:', params); // 调试日志
      this.commentData = {
        memberName: params['memberName'],
        memberEmail: params['memberEmail'],
        commentFirstName: params['commentFirstName'],
        commentRoomTypeName: params['commentRoomTypeName'],
        commentTravelerType: params['commentTravelerType'],
        commentTitle: params['commentTitle'],
        commentText: params['commentText'],
        commentCreatedAt: params['commentCreatedAt'],
        commentID: params['commentID'],
        memberID: params['memberID']
      };
    });
  }






  onTitleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const title = selectElement.value;
    this.selectedTitle = title;
    console.log('Selected Title:', title); // 調試日誌

    switch (title) {
      case '1':
        this.selectedSubtitles = this.ordersubtitles;
        break;
      case '2':
        this.selectedSubtitles = this.financesubtitles;
        break;
      case '3':
        this.selectedSubtitles = this.productsubtitles;
        break;
      case '4':
        this.selectedSubtitles = this.contractsubtitles;
        break;
      default:
        this.selectedSubtitles = [];
        break;
    }
    console.log('Updated Subtitles:', this.selectedSubtitles); // 調試日誌

    // 如果有副標題選項,將 selectedSubtitle 設置為第一個選項
    if (this.selectedSubtitles.length > 0) {
      console.log('First subtitle value:', this.selectedSubtitles[0].value);
      this.selectedSubtitle = this.selectedSubtitles[0].value;
    } else {
      this.selectedSubtitle = '';
    }
  }


  onTitleChangeshort(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTitle = selectElement.value;
    console.log('Selected title ID:', this.selectedTitle);
  }

  onSubtitleChange(newValue: string): void {
    this.selectedSubtitle = newValue;
    console.log('Selected Subtitle ID:', this.selectedSubtitle); // 紀錄選中的副標題 ID
  }

  // onSubmit(): void {
  //   const reportReview = {
  //     CommentID: this.commentID,
  //     MemberID: this.memberID,
  //     ReportTitleID: this.selectedTitle,
  //     ReportSubtitleID: this.selectedSubtitle,
  //     ReportedAt: new Date(),
  //     ReportReason: this.reportReason,
  //     ReviewStatus: 1
  //   };

  //   this.commentService.submitReport(reportReview).subscribe(
  //     response => {
  //       console.log('Report submitted successfully', response);
  //     },
  //     error => {
  //       console.error('Error submitting report', error);
  //     }
  //   );
  // }


  openDialog(): void {
    const dialogRef = this.dialog.open(ReportDetailDialogComponent, {
      width: '250px',
      data: {
        dialogType: 'reportcomfirm',
        ...this.commentData,
        reportReason: this.reportReason,
        reportTitleID: this.selectedTitle,
        reportSubtitleID: this.selectedSubtitle
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // 处理确认后的操作
        console.log('表單已送出');
      }
    });
  }



}
