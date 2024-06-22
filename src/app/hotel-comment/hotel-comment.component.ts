import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommentService } from './../service/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { ChangeDetectorRef } from '@angular/core';
import { data } from 'jquery';

@Component({
  selector: 'app-hotel-comment',
  templateUrl: './hotel-comment.component.html',
  styleUrls: ['./hotel-comment.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelCommentComponent implements OnInit{
  @ViewChild('commentContainer') commentContainer!: ElementRef;

  currentSlide = 0;
  leftColumnScores: { key: string, value: number }[] = [];
  rightColumnScores: { key: string, value: number }[] = [];
  ratingRanges = [
    { key: 2, label: '超讚:9+' },
    { key: 3, label: '很讚:7-9' },
    { key: 4, label: '很好:5-7' },
    { key: 5, label: '尚可:3-5' },
    { key: 6, label: '低於預期:1-3' }
  ];

  monthRanges = [
    { key: '3-5月', label: '3-5月' },
    { key: '6-8月', label: '6-8月' },
    { key: '9-11月', label: '9-11月' },
    { key: '12-2月', label: '12-2月' },
  ];

  //icon
  fauserlarge = faUserLarge;
  // <i class="fa-solid fa-caret-right fa-2xl"></i>
facaretright = faCaretRight;
facaretleft = faCaretLeft;


  hotelName!: string; // 使用非空斷言操作符
  statistics: any;
  page: number = 1;
  pageSize: number = 10;
  search: string = '';
  ratingFilter: number | null = null;
  dateFilter: string | null = null;
  sortOrder: string = 'newest'; // 預設排序為最新
  selectedTopics: string[] = [];
  totalItems: number = 0;
  totalComments = 0; // 获取总评论笔数
  totalCommentcounts = 0;
  comments: any[] = [];
  memberInfo: any[] = [];
  combinedData: any[] = [];
  averageScores: any[] = [];
  totalAverageScore: number = 0;
  isSearchVisible: boolean = false;
  ratingText: string = '';
  rateCounts: Map<number, number> = new Map();
  monthCounts: Map<string, number> = new Map();

  scoreKeyMap: { [key: string]: string } = {
    cleanlinessScore: '清潔度',
    comfortScore: '舒適度',
    facilitiesScore: '設施',
    freeWifiScore: '免費WiFi',
    locationScore: '地點',
    staffScore: '員工',
    valueScore: '性價比'
  };

  //MVC hotel頁有帶的參數
  @Input()hotelId :number = 0;
  @Input()checkInDate:string='';
  @Input()checkOutDate:string='';
  @Input() memberID: number = 0;

  constructor(
    private commentService: CommentService ,
     private route: ActivatedRoute,
     private router: Router,
     private cdr: ChangeDetectorRef){
  }

  // ngAfterViewInit() {
  //   this.startScrolling();
  // }
  ngOnInit(): void {
    // console.log('Received parameters:', {
    //   hotelId: this.hotelId,
    //   checkInDate: this.checkInDate,
    //   checkOutDate: this.checkOutDate,
    //   memberID: this.memberID
    // });
    this.getHotelComment();
    this.AvgText();
    this.loadComments();
    this.loadAverageScore();
  }


  totalcommentcount:number= 0;

  getHotelComment(): void {
    this.commentService.getHotelComment(this.hotelId).subscribe(
      data => {
        this.totalcommentcount = data.totalComments;
        this.comments = data.topComments;

        console.log('Comments Data:', data);
        this.cdr.markForCheck();  // Ensure Angular detects the changes
      },
      error => {
        console.error('Error fetching comments:', error);
      }
    );
  }



  averageScore:number = 0;
  AvgText() {
    this.commentService.getAvgTxt(this.hotelId).subscribe(data => {

      this.hotelId = data.hotelId;
      this.ratingText = data.ratingText;
      this.averageScore = data.averageScore;
      this.cdr.markForCheck();
    }, error => {
      console.error('Error fetching rating text:', error);
    });
  }

  report(comment: any): void {
    console.log('Navigating with comment:', comment);
    this.router.navigate(['/reportform'], {
      queryParams: {
        memberName: 'John Doe', // 檢舉人（測試）
        memberEmail: 'john.doe@example.com', // 檢舉人信箱（測試）
        commentFirstName: comment.firstName,
        commentRoomTypeName: comment.roomTypeName,
        commentTravelerType: comment.travelerType,
        commentTitle: comment.commentTitle,
        commentText: comment.commentText,
        commentCreatedAt: comment.createdAt,
        commentID: comment.commentId,
        memberID: comment.memberId
      }
    });
  }
  // 加載評論
  loadComments(): void {
    const ratingFilter = this.ratingFilter !== null ? this.ratingFilter : undefined;
    const dateFilter = this.dateFilter !== null ? this.dateFilter : undefined;
    const combinedSearch = [...this.selectedTopics, this.search].filter(Boolean).join(' ');



    this.commentService.getComments(this.hotelId, this.page, this.pageSize, combinedSearch, ratingFilter, dateFilter, this.sortOrder, this.selectedTopics.join(' '))
      .subscribe(data => {
        // this.comments = data.comments;
        // this.memberInfo = data.memberInfo;
        // this.hotelName = data.hotelName;
        // this.totalItems = data.totalItems;
        // this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        // this.totalComments = data.totalComments;
        // this.totalAverageScore = data.totalAverageScore;

        console.log('Received data:', data);
        this.combineData();
        this.cdr.markForCheck();

      });
  }


  combineData() {
    this.combinedData = this.memberInfo.map(member => {
      const comment = this.comments.find(c => c.commentId === member.commentId);
      if (comment) {
        const ratingScores = comment.ratingScores || [];

        const avgScoresPerCom = {
          totalAverageScore: (
            this.calculateAverage(ratingScores, 'cleanlinessScore') +
            this.calculateAverage(ratingScores, 'comfortScore') +
            this.calculateAverage(ratingScores, 'facilitiesScore') +
            this.calculateAverage(ratingScores, 'freeWifiScore') +
            this.calculateAverage(ratingScores, 'locationScore') +
            this.calculateAverage(ratingScores, 'staffScore') +
            this.calculateAverage(ratingScores, 'valueScore')
          ) / 7
        };

        return {
          ...member,
          ...comment,
          avgScoresPerCom
        };
      } else {
        console.warn(`Comment with ID ${member.commentId} not found in comments`);
        return member;
      }
    });

    console.log('Combined Data:', this.combinedData);
  }

  calculateAverage(scores: any[], key: string): number {
    const total = scores.reduce((sum, score) => sum + score[key], 0);
    return total / scores.length;
  }



  loadAverageScore(): void {
    this.commentService.getAverageScores(this.hotelId).subscribe(
      data => {
        this.averageScores = Object.entries(data.averageScore).map(([key, value]) => ({
          key: this.scoreKeyMap[key] || key, // 將key轉換為中文名稱
          value
        }));
        this.totalAverageScore = data.totalAverageScore;
        this.leftColumnScores = this.averageScores.slice(0, 4); // 左边四个
      this.rightColumnScores = this.averageScores.slice(4); // 右边三个
        this.cdr.markForCheck();
        // console.log('AVG Data:', data);
      },
      error => {
        console.error('Error loading average scores:', error);
      }
    );
  }













    //TODO 分頁尚未處理(選別頁會一直跳第一頁)
    currentPage: number = 1; // 預設當前頁碼為 1
    visiblePages: number = 5;
    totalPages: number = 0;
    getPageNumbers(): number[] {
      let startPage: number, endPage: number;

      if (this.totalPages <= this.visiblePages) {
        startPage = 1;
        endPage = this.totalPages;
      } else {
        if (this.currentPage <= Math.floor(this.visiblePages / 2)) {
          startPage = 1;
          endPage = this.visiblePages;
        } else if (this.currentPage + Math.floor(this.visiblePages / 2) >= this.totalPages) {
          startPage = this.totalPages - this.visiblePages + 1;
          endPage = this.totalPages;
        } else {
          startPage = this.currentPage - Math.floor(this.visiblePages / 2);
          endPage = this.currentPage + Math.floor(this.visiblePages / 2);
        }
      }

      // 確保 endPage 始終大於或等於 startPage
      endPage = Math.max(endPage, startPage);

      return Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
    }

    setPage(page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        // console.log('Current Page:', this.currentPage);
        this.getHotelComment(); // 添加頁面切換邏輯
      }
    }

    //只顯示30字
    truncateText(commentText: string, limit: number): string {
      return commentText.length > limit ? commentText.substring(0, limit) + '...' : commentText;
    }



    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % (this.combinedData.length / 3);
      this.cdr.markForCheck();
    }

    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + (this.combinedData.length / 3)) % (this.combinedData.length / 3);
      this.cdr.markForCheck();
    }
    //3個卡片一組
    getChunks(array: any[], size: number): any[][] {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }
    //資料不是3的倍數時，補齊卡片
    getEmptyCards(length: number): number[] {
      return Array(3 - length).fill(0);
    }

}
