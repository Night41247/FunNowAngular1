import { CommentService } from './../service/comment.service';
import { Component, Input, OnInit } from '@angular/core';
import { CommentQueryParameters, Score } from '../model/comment';
import { ActivatedRoute, Router } from '@angular/router';

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
    { key: '1-3', label: '3-5月' },
    { key: '4-6', label: '6-8月' },
    { key: '7-9', label: '9-11月' },
    { key: '10-12', label: '12-2月' },
  ];

 // TODO: 測試時寫死
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
  hotelavgScore:number = 0;
  isSearchVisible: boolean = false;
  ratingText:string='';
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

AVGscore:number = 0;
@Input() hotelId: number = 0;
@Input() checkInDate: string = '';
@Input() checkOutDate: string = '';
@Input() memberID: number = 0;
  memberName: string = '';
  memberEmail: string = '';

  constructor(
    private commentService: CommentService ,
    private route: ActivatedRoute,
    private router: Router,
  )
  {
  }


  ngOnInit(): void {
    console.log('Received parameters:', {
      hotelId: this.hotelId,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      memberID: this.memberID
    });
    if (this.memberID) {
      this.fetchMemberInfo(this.memberID);
    } else {
      console.error('MemberID is undefined');
    }
    this.loadComments();

    this.fetchMemberInfo(this.memberID);
    this.loadCommentCounts();
    this.loadAverageScore();
    this.AvgText();
    this.loadAVGscore();
    this.loadComments();

  }

//   ngOnInit(): void {

//     // 使用这些参数进行其他初始化操作
//     console.log('Received parameters:', {
//       commentId: this.commentId,
//       hotelName: this.hotelName,
//       roomtypeName: this.roomtypeName,
//       checkinDate: this.checkinDate,
//       checkoutDate: this.checkoutDate,
//       roomId: this.roomId,
//       memberId: this.memberId,
//       nights: this.nights
//     });

//   //背景
//   this.initBlobs();
// }

  AvgText() {
    this.commentService.getAvgTxt(this.hotelId).subscribe(data => {

      this.hotelId = data.hotelId;
      this.hotelavgScore = data.averageScore;
      this.ratingText = data.ratingText;
      this.totalCommentcounts = data.counts;
    }, error => {
      // console.error('Error fetching rating text:', error);
    });
  }

  report(comment: any): void {

    const selectedComment = {
      ...comment,
      memberName: this.memberName,
      memberEmail: this.memberEmail
    };
    console.log('Navigating with comment:', selectedComment);
    const queryParams = new URLSearchParams({
      memberName: selectedComment.memberName,
      memberEmail: selectedComment.memberEmail,
      commentFirstName: selectedComment.firstName,
      commentRoomTypeName: selectedComment.roomTypeName,
      commentTravelerType: selectedComment.travelerType,
      commentTitle: selectedComment.commentTitle,
      commentText: selectedComment.commentText,
      commentCreatedAt: selectedComment.createdAt,
      commentID: selectedComment.commentId.toString(),
    }).toString();
    const url = `https://localhost:7284/Comment/Angular_reportform?${queryParams}`;
    console.log('Navigating to:', url);
    window.location.href = url;
  }

  fetchMemberInfo(memberID: number): void {
    this.commentService.getMemberInfo(memberID).subscribe(data => {
      this.memberName = data.firstName;
      this.memberEmail = data.email;
      console.log('Member Info:', data);
    });
  }


//透過service傳送資料到report
selectComment(comment: any): void {
  const selectedComment = {
    ...comment,
    memberName: this.memberName,
    memberEmail: this.memberEmail
  };
  this.commentService.changeCommentData(selectedComment);
}

  // 加載評論
  loadComments(): void {
    const ratingFilter = this.ratingFilter !== null ? this.ratingFilter : undefined;
    const dateFilter = this.dateFilter !== null ? this.dateFilter : undefined;
    const combinedSearch = [...this.selectedTopics, this.search].filter(Boolean).join(' ');

    // console.log('Loading comments with params:', {
    //   hotelId: this.hotelId,
    //   page: this.page,
    //   pageSize: this.pageSize,
    //   search: combinedSearch,
    //   ratingFilter: ratingFilter,
    //   dateFilter: dateFilter,
    //   sortOrder: this.sortOrder,
    //   topics: this.selectedTopics.join(' ')
    // });

    this.commentService.getComments(this.hotelId, this.page, this.pageSize, combinedSearch, ratingFilter, dateFilter, this.sortOrder, this.selectedTopics.join(' '))
      .subscribe(data => {
        this.comments = data.comments;
        this.memberInfo = data.memberInfo;
        this.hotelName = data.hotelName;
        this.totalItems = data.totalItems;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.totalComments = data.totalComments;
        this.totalAverageScore = data.totalAverageScore;

        // console.log('Received data:', data);

        this.combineData();
        this.applySort(); // 调用排序方法
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
        // console.warn(`Comment with ID ${member.commentId} not found in comments`);
        return member;
      }
    });

    console.log('Combined Data:', this.combinedData);
  }

  calculateAverage(scores: any[], key: string): number {
    const total = scores.reduce((sum, score) => sum + score[key], 0);
    return total / scores.length;
  }

  //僅用來抓hotel avgscore
  loadAVGscore(): void {
    this.commentService.getAVGscore(this.hotelId).subscribe(
      data => {
        this.AVGscore = data.totalAverageScore;
        // console.log('AVGscore:', this.AVGscore);
      },
      error => {
        // console.error('Error fetching average score:', error);
      }
    );
  }

  loadAverageScore(): void {
    this.commentService.getAverageScores(this.hotelId).subscribe(
      data => {
        this.averageScores = Object.entries(data.averageScore).map(([key, value]) => ({
          key: this.scoreKeyMap[key] || key, // 將key轉換為中文名稱
          value
        }));
        this.totalAverageScore = data.totalAverageScore;

        // console.log('AVG Data:', data);
      },
      error => {
        // console.error('Error loading average scores:', error);
      }
    );
  }

 // 加載評論數量
 loadCommentCounts(): void {
  this.commentService.getCommentCounts(this.hotelId).subscribe(data => {


    const ratingCommentDetailsArray = Object.entries(data.ratingCommentDetails);
    ratingCommentDetailsArray.forEach(([rating, detail]) => {
      const ratingDetail = detail as { count: number; comments: any[] };
      this.rateCounts.set(parseInt(rating, 10), ratingDetail.count);
    });

    // console.log('Updated Rating Counts:', Array.from(this.rateCounts.entries()));

    const dateCommentDetailsArray = Object.entries(data.dateCommentDetails);
    dateCommentDetailsArray.forEach(([dateRange, detail]) => {
      const dateDetail = detail as { count: number; comments: any[] };
      this.monthCounts.set(dateRange, dateDetail.count);
    });

    // console.log('Updated Month Counts:', Array.from(this.monthCounts.entries()));
  });
}

trackByFn(index: number, item: any): any {
  return item.key; // or item.id
}


filterByRating(event: any): void {
  this.ratingFilter = event;
  this.page = 1;
  this.loadComments();
  console.log('Rating Filter:', this.ratingFilter);
}

filterByDate(date: string | null): void {
  this.dateFilter = date;
  this.page = 1;
  this.loadComments();
  console.log('Date Filter:', this.dateFilter);
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



    // 顯示或隱藏搜索欄
    toggleSearch(): void {
      this.isSearchVisible = !this.isSearchVisible;
    }




    // 根據主題篩選評論
    filterByTopic(topic: string): void {
      const index = this.selectedTopics.indexOf(topic);
      if (index === -1) {
        this.selectedTopics.push(topic);
      } else {
        this.selectedTopics.splice(index, 1);
      }
      this.applyFilters();
    }

    applyFilters(): void {
      this.page = 1;
      this.loadComments();
    }

    // 根據排序方式篩選評論
    sortBy(event: any): void {
      this.sortOrder = event;
      this.page = 1;
      this.loadComments();
      // console.log('Sort Order:', this.sortOrder);
    }

    applySort(): void {
      if (this.sortOrder === 'highestScore') {
        this.combinedData.sort((a, b) => b.avgScoresPerCom.totalAverageScore - a.avgScoresPerCom.totalAverageScore);
      } else if (this.sortOrder === 'lowestScore') {
        this.combinedData.sort((a, b) => a.avgScoresPerCom.totalAverageScore - b.avgScoresPerCom.totalAverageScore);
      } else if (this.sortOrder === 'newest') {
        this.combinedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (this.sortOrder === 'oldest') {
        this.combinedData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
      // console.log('Sorted Combined Data:', this.combinedData);
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
        console.log('Current Page:', this.currentPage);
        this.loadComments(); // 添加頁面切換邏輯
      }
    }
  }


















