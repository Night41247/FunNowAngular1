
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../service/comment.service';



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
  constructor(private route: ActivatedRoute,private http: HttpClient,private commentService: CommentService) {}

  selectedSubtitles: Subtitle[] = [];
  selectedSubtitle: string = '';
  selectedTitle: string = '';

  titles: Title[] = [
    { value: 'order', viewValue: '訂單相關' },
    { value: 'finance', viewValue: '財務與帳單' },
    { value: 'business', viewValue: '商務與產品相關' },
    { value: 'contract', viewValue: '加入FunNow或終止合約' }
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.memberName = params['memberName'] || 'John Doe'; // 默认值用于测试
      this.memberEmail = params['memberEmail'] || 'john.doe@example.com'; // 默认值用于测试
      this.commentFirstName = params['commentFirstName'] || '';
      this.commentRoomTypeName = params['commentRoomTypeName'] || '';
      this.commentTravelerType = params['commentTravelerType'] || '';
      this.commentTitle = params['commentTitle'] || '';
      this.commentText = params['commentText'] || '';
      this.commentCreatedAt = params['commentCreatedAt'] || '';
      this.commentID = +params['commentID'] || 0;
      this.memberID = +params['memberID'] || 0;
    });

  }






  onTitleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const title = selectElement.value;
    console.log('Selected Title:', title); // 調試日誌
    switch (title) {
      case 'order':
        this.selectedSubtitles = this.ordersubtitles;
        break;
      case 'finance':
        this.selectedSubtitles = this.financesubtitles;
        break;
      case 'business':
        this.selectedSubtitles = this.productsubtitles;
        break;
      case 'contract':
        this.selectedSubtitles = this.contractsubtitles;
        break;
      default:
        this.selectedSubtitles = [];
        break;
    }
    console.log('Updated Subtitles:', this.selectedSubtitles); // 調試日誌

    // 如果有副標題選項,將 selectedSubtitle 設置為第一個選項
    if (this.selectedSubtitles.length > 0) {
      this.selectedSubtitle = this.selectedSubtitles[0].value;
    } else {
      this.selectedSubtitle = '';
    }
  }
  onTitleChangeshort(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTitle = selectElement.value;
  }



  onSubmit(): void {
    const reportReview = {
      CommentID: this.commentID,
      MemberID: this.memberID,
      ReportTitleID: this.selectedTitle,
      ReportSubtitleID: this.selectedSubtitle,
      ReportedAt: new Date(),
      ReportReason: this.reportReason,
      ReviewStatus: 1
    };

    this.commentService.submitReport(reportReview).subscribe(
      response => {
        console.log('Report submitted successfully', response);
      },
      error => {
        console.error('Error submitting report', error);
      }
    );
  }



}
