import { CommentService } from './../service/comment.service';
import { Component, Input, OnInit } from '@angular/core';
import { CommentQueryParameters, Score } from '../model/comment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit{
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

  hotelId = 2; // TODO: 測試時寫死
  hotelName!: string; // 使用非空斷言操作符
  statistics: any;
  page: number = 1;
  pageSize: number = 10;
  search: string = '';
  ratingFilter: number | null = null;
  dateFilter: string | null = null;
  sortOrder: string = 'newest'; // 預設排序為最新

  comments: any[] = [];
  totalItems: number = 0;
  averageScores: any[] = [];
  totalAverageScore: number = 0;
  isSearchVisible: boolean = false;
  totalCommentCount: number = 0;

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

  constructor(private commentService: CommentService , private route: ActivatedRoute){}


  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('hotelId');
    if (hotelId) {
      this.hotelId = +hotelId; // 將 hotelId 轉換為數字類型
    }
    this.loadComments();
    this.loadCommentCounts();
    this.loadAverageScore();
  }


  // loadMonthRanges(): void {
  //   this.commentService.getMonthRanges().subscribe(ranges => {
  //     this.monthRanges = ranges;
  //   });
  // }



  // 加載評論
  loadComments(): void {
    const ratingFilter = this.ratingFilter !== null ? this.ratingFilter : undefined;
    const dateFilter = this.dateFilter !== null ? this.dateFilter : undefined;
    this.commentService.getComments(this.hotelId, this.page, this.pageSize, this.search, ratingFilter,dateFilter, this.sortOrder)
      .subscribe(data => {
        this.comments = data.Comments;
        this.hotelName = data.hotelName;
        this.totalItems = data.totalItems;
        console.log('Comments Data:', data);
      });
  }

  loadAverageScore(): void {
    this.commentService.getAverageScores(this.hotelId).subscribe(
      data => {
        this.averageScores = Object.entries(data.averageScore).map(([key, value]) => ({
          key: this.scoreKeyMap[key] || key, // 將key轉換為中文名稱
          value
        }));
        this.totalAverageScore = data.totalAverageScore;

        console.log('AVG Data:', data);
      },
      error => {
        console.error('Error loading average scores:', error);
      }
    );
  }

 // 加載評論數量
 loadCommentCounts(): void {
  this.commentService.getCommentCounts().subscribe(data => {
    console.log('Received Comment Counts:', data);

    const ratingCommentDetailsArray = Object.entries(data.ratingCommentDetails);
    ratingCommentDetailsArray.forEach(([rating, detail]) => {
      const ratingDetail = detail as { count: number; comments: any[] };
      this.rateCounts.set(parseInt(rating, 10), ratingDetail.count);
    });


    console.log('Updated Rating Counts:', Array.from(this.rateCounts.entries()));

    // 更新月份範圍的計數
    for (const [key, value] of Object.entries(data.DateCommentDetails)) {
      const dateDetail = value as { Count: number; Comments: any[] };
      this.monthCounts.set(key, dateDetail.Count);

    }
    console.log('Updated Month Counts:', Array.from(this.monthCounts.entries()));

    // 構建月份範圍的選項
    this.monthRanges = Object.keys(data.DateCommentDetails).map(key => ({ key, label: key }));

  });
}

filterByRating(event: any): void {
  this.loadComments();
}

filterByDate(date: string | null): void {
  this.dateFilter = date;
  this.loadComments();
}


    // 搜索評論
    searchComments(): void {
      this.page = 1;
      this.loadComments();
    }

    // 添加評論
    addComment(newComment: any): void {
      this.commentService.postCommentAPI(newComment).subscribe(() => {
        this.loadComments();
      });
    }

    // 切換到下一頁
    nextPage(): void {
      if (this.page * this.pageSize < this.totalItems) {
        this.page++;
        this.loadComments();
      }
    }

    // 切換到上一頁
    prevPage(): void {
      if (this.page > 1) {
        this.page--;
        this.loadComments();
      }
    }

    // 設定當前頁碼
    setPage(page: number): void {
      this.page = page;
      this.loadComments();
    }

    // 顯示或隱藏搜索欄
    toggleSearch(): void {
      this.isSearchVisible = !this.isSearchVisible;
    }




    // 根據主題篩選評論
    filterByTopic(topic: string): void {
      this.search = topic;
      this.page = 1;
      this.loadComments();
    }

    // 根據排序方式篩選評論
    sortBy(event: Event): void {
      const target = event.target as HTMLSelectElement;
      this.sortOrder = target.value;
      this.page = 1; // 重置頁碼為第一頁
      this.loadComments();
    }

    // 獲取所有頁碼數
    getPageNumbers(): number[] {
      const totalPages = Math.ceil(this.totalItems / this.pageSize);
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }









  }










