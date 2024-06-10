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
interface title {
  value: string;
  viewValue: string;
}

interface subtitle {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-platform-comment',
  templateUrl: './platform-comment.component.html',
  styleUrls: ['./platform-comment.component.css']
})
export class PlatformCommentComponent {

  constructor(private commentService: CommentService , private route: ActivatedRoute, public dialog: MatDialog){}

  faUser = faUser;
  faHouse = faHouse;
  faFaceSmile = faFaceSmile;
  faComment = faComment;
  faChartLine = faChartLine;

  reports: any[] = [];
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
    {value: '1', viewValue: '顧客不當行為'},
    {value: '2', viewValue: '訂單相關'},
    {value: '3', viewValue: '住客評語'},

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

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    const filters = {
      titleId: this.selectedTitleId,
      subtitleId: this.selectedSubtitle,
      startDate: this.startDate,
      endDate: this.endDate,
      searchText: this.searchText,
      status: this.selectedStatus,
    };
    this.commentService.getReportComment(filters).subscribe(
      data => {
        this.reports = data;
        console.log('Reports loaded:', this.reports);
      },
      error => {
        console.error('Error loading reports:', error);
      }
    );
  }





  onTitleChange(event: any): void {
    this.selectedTitleId = event.value;
    this.updateSubtitles();
    this.loadReports();
  }

  onSearch(): void {
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
        break;
    }
    const subtitle = subtitles.find(s => s.value === subtitleId);
    return subtitle ? subtitle.viewValue : '';
  }

  openDialog(report: any): void {
    this.dialog.open(ReportDetailDialogComponent, {
      width: '250px',
      data: report
    });









}
}
