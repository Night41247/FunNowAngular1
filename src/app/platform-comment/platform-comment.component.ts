import { CommentService } from './../service/comment.service';
import { Component } from '@angular/core';
import {createPopper} from '@popperjs/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { ReportDetailDialogComponent } from '../report-detail-dialog/report-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';





interface title {
  value: string;
  viewValue: string;
}

interface subtitle {
  value: string;
  viewValue: string;
}

interface Report {
  reportId: number;
  commentId: number;
  memberId: number;
  reportTitleId: number;  // 確保這些屬性是 number 類型
  reportSubtitleId: number;  // 確保這些屬性是 number 類型
  reportedAt: string;
  reportReason: string;
  reviewStatus: number;
  reviewedBy: number;
  reviewedAt: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
}


@Component({
  selector: 'app-platform-comment',
  templateUrl: './platform-comment.component.html',
  styleUrls: ['./platform-comment.component.css']
})
export class PlatformCommentComponent {

  constructor(private commentService: CommentService , private route: ActivatedRoute, public dialog: MatDialog,private cdr: ChangeDetectorRef){}

  faUser = faUser;
  faHouse = faHouse;
  faFaceSmile = faFaceSmile;
  faComment = faComment;
  faChartLine = faChartLine;

  reports: Report[] = [];
  filteredReports: Report[] = [];
  selectedTitleId: string = '';
  selectedSubtitles: subtitle[] = [];
  selectedSubtitle: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  searchText: string = '';
  selectedStatus: string = '';



  titles: title[] = [
    {value: '1', viewValue: '訂單相關'},
    {value: '2', viewValue: '財務與帳單'},
    {value: '3', viewValue: '商務與產品相關'},
    {value: '4', viewValue: '加入FunNow或終止合約'}
  ];

  ordersubtitles: subtitle[] = [
    {value: '1', viewValue: '住客評語'},
    {value: '2', viewValue: '訂單相關'},
    {value: '3', viewValue: '顧客不當行為'},

  ];

  financesubtitles: subtitle[] = [
    {value: '1', viewValue: '收費相關客訴'},
    {value: '2', viewValue: '佣金'},
    {value: '3', viewValue: '未付款導致暫時關閉'},
    {value: '4', viewValue: '延遲付款'},
    {value: '5', viewValue: '退款'},
  ];

  productsubtitles: subtitle[] = [
    {value: '1', viewValue: '條款與條件'},
    {value: '2', viewValue: '商業表現'},
    {value: '3', viewValue: '錯誤或技術性問題'},

  ];

  contractsubtitles: subtitle[] = [
    {value: '1', viewValue: '無法終止合約'},
    {value: '2', viewValue: '無法在FunNow接受預訂'},
    {value: '3', viewValue: '被FunNow終止合約'},

  ];

  reviewStatusMapping: { [key: number]: string } = {
    1: '未審核',
    2: '審核中',
    3: '審核通過',
    4: '審核不通過'
  };

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const filters = {
      titleId: this.selectedTitleId,
      subtitleId: this.selectedSubtitle,
      startDate: this.startDate ? this.startDate.toISOString() : null,
      endDate: this.endDate ? this.endDate.toISOString() : null,
      searchText: this.searchText,
      status: this.selectedStatus,
    };

    console.log('Applying filters:', filters); // 調試日志

    this.commentService.getReportComment(filters).subscribe(
      data => {
        console.log('Loaded reports:', data); // 調試日志
        this.reports = data; // 確保這裡獲取到的數據是最新的
        this.filterReportsByStatus();
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error loading reports:', error);
      }
    );
  }


  clearFilters(): void {
    this.selectedTitleId = '';
    this.selectedSubtitle = '';
    this.startDate = null;
    this.endDate = null;
    this.searchText = '';
    this.selectedStatus = '';
    this.loadReports();
  }

  filterReportsByStatus(): void {
    this.filteredReports = this.reports;

    if (this.selectedStatus) {
      console.log('Filtering by status:', this.selectedStatus);
      this.filteredReports = this.filteredReports.filter(report => this.reviewStatusMapping[report.reviewStatus] === this.selectedStatus);
    }

    if (this.selectedTitleId) {
      console.log('Filtering by title:', this.selectedTitleId);
      this.filteredReports = this.filteredReports.filter(report => report.reportTitleId === parseInt(this.selectedTitleId, 10));
    }

    if (this.selectedSubtitle) {
      console.log('Filtering by subtitle:', this.selectedSubtitle);
      this.filteredReports = this.filteredReports.filter(report => report.reportSubtitleId === parseInt(this.selectedSubtitle, 10));
    }

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).getTime();
      const end = new Date(this.endDate).getTime();
      console.log('Filtering by date range:', start, end);
      this.filteredReports = this.filteredReports.filter(report => {
        const reportedAt = new Date(report.reportedAt).getTime();
        return reportedAt >= start && reportedAt <= end;
      });
    }

    if (this.searchText) {
      const searchTextLower = this.searchText.toLowerCase();
      console.log('Filtering by search text:', searchTextLower);
      this.filteredReports = this.filteredReports.filter(report =>
        report.memberName.toLowerCase().includes(searchTextLower) ||
        report.memberEmail.toLowerCase().includes(searchTextLower) ||
        report.memberPhone.includes(this.searchText)
      );
    }

    console.log('Filtered reports:', this.filteredReports); // 調試日志
    this.cdr.detectChanges();
  }




  onStatusChange(): void {
    this.filterReportsByStatus();
  }

  onTitleChange(event: any): void {
    this.selectedTitleId = event.value;
    this.updateSubtitles();
    this.loadReports();
  }

  onSearch(): void {
    this.loadReports();
  }

  onDateChange(): void {
    this.loadReports();
  }

  onSearchTextChange(): void {
    this.loadReports();
  }

  updateSubtitles(): void {
    switch (this.selectedTitleId) {
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
    if (this.selectedSubtitles.length > 0) {
      this.selectedSubtitle = this.selectedSubtitles[0].value;
    }
    this.loadReports();
  }

  getTitleViewValue(titleId: string): string {
    const title = this.titles.find(t => t.value === titleId);
    return title ? title.viewValue : '';
  }


  getSubtitleViewValue(titleId: string, subtitleId: string): string {
    let subtitles: subtitle[] = [];
    switch (titleId) {
      case '1':
        subtitles = this.ordersubtitles;
        break;
      case '2':
        subtitles = this.financesubtitles;
        break;
      case '3':
        subtitles = this.productsubtitles;
        break;
      case '4':
        subtitles = this.contractsubtitles;
        break;
      default:
        subtitles = [];
    }
    const subtitle = subtitles.find(s => s.value === subtitleId);
    return subtitle ? subtitle.viewValue : '';
  }


trackByReportId(index: number, report: any): number {
  return report.reportId;
}







  openDialog(report: any): void {
    this.dialog.open(ReportDetailDialogComponent, {
      width: '250px',
      data: { reportReason: report.reportReason }
    });
  }


  onReviewStatusChange(report: Report): void {
    // 2 for "審核中", 3 for "通過", 4 for "不通過"
    const newStatus = report.reviewStatus;

    // 更新審核狀態
    this.commentService.updateCommentStatus(report.commentId, newStatus).subscribe(
      response => {
        console.log('Comment status updated:', response);
        // 更新報告的審核狀態
        const updatedReport = this.reports.find(r => r.reportId === report.reportId);
        if (updatedReport) {
          updatedReport.reviewStatus = newStatus;
        }

        // 如果狀態是不通過，發送郵件
        if (newStatus === 4) {
          const email = "5525asd9896@gmail.com";  // 指定的信箱
          const subject = "審核結果通知";
          const body = `用戶 ${report.memberName} 的評論未通過審核，請遵守我們的評論規範。`;

          this.commentService.sendEmail(email, subject, body).subscribe(
            emailResponse => {
              console.log('Email sent successfully:', emailResponse);
            },
            emailError => {
              console.error('Error sending email:', emailError);
            }
          );
        }

        // 重新應用篩選條件
        this.filterReportsByStatus();
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error updating comment status:', error);
      }
    );
  }






}
