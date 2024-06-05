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

  // hotelId!: number;
  hotelId=2; //to do先寫死
  hotelName!: string;
  statistics: any;
  page: number = 1;
  pageSize: number = 10;
  search: string = '';
  ratingFilter: number | null = null;
  dateFilter: string = '';

  //評論
  comments:Comment[] = [];
  totalItems:number = 0;
  averageScores: any = {};
  //確定屬性會在使用前初始化，可以使用!非空斷言運算符來告訴TypeScript編譯器
  //或提供默認值  totalAverageScore: number = 0;
  totalAverageScore: number = 0;
  queryParameters:CommentQueryParameters = new CommentQueryParameters();
  isSearchVisible: boolean = false;

   ratingRanges = [
    { key: 0, label: '全部' },
    { key: 2, label: '超讚:9+' },
    { key: 3, label: '很讚:7-9' },
    { key: 4, label: '很好:5-7' },
    { key: 5, label: '尚可:3-5' },
    { key: 6, label: '低於預期:1-3' }
  ];
  rateCounts: Map<number, number> = new Map();


  constructor(private commentService: CommentService , private route: ActivatedRoute){}


  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('hotelId');
    if (hotelId) {
      this.hotelId = +hotelId; // 將 hotelId 轉換為數字類型
    }
    this.loadComments(this.hotelId);
    this.loadCommentCounts();
  }


  loadComments(hotelId: number): void {
    this.commentService.getComments(hotelId, this.queryParameters.page, this.queryParameters.pageSize, this.queryParameters.search, this.queryParameters.ratingFilter, this.queryParameters.dateFilter)
      .subscribe(data => {
        this.comments = data.comments;
        this.hotelName = data.hotelName;
        this.totalItems = data.totalItems;
        this.averageScores = [
          { key: '舒適程度', value: data.averageScore.comfortScore },
          { key: '清潔程度', value: data.averageScore.cleanlinessScore },
          { key: '員工素質', value: data.averageScore.staffScore },
          { key: '設施', value: data.averageScore.facilitiesScore },
          { key: '性價比', value: data.averageScore.valueScore },
          { key: '住宿地點', value: data.averageScore.locationScore },
          { key: '免費WIFI', value: data.averageScore.freeWifiScore }
        ];
        this.totalAverageScore = data.totalAverageScore;
        this.statistics = data.Statistics;
        console.log('Average Scores: ', this.averageScores);
      });
  }

  loadCommentCounts(): void {
    this.commentService.getCommentCounts().subscribe(data => {
      this.totalItems = data.total;
      this.rateCounts = new Map<number, number>(data.counts);
    });
  }

  filterByRating(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const ratingFilter = Number(target.value);
    this.loadComments(ratingFilter);
  }

  // calculateAverageScore(comments: any[]): number {
  //   let totalScore = 0;
  //   let count = 0;
  //   comments.forEach(comment => {
  //     comment.ratingScores.forEach(score => {
  //       totalScore += (score.comfortScore + score.cleanlinessScore + score.staffScore + score.facilitiesScore + score.valueScore + score.locationScore + score.freeWifiScore) / 7;
  //       count++;
  //     });
  //   });
  //   return totalScore / count;
  // }

  searchComments():void{
    this.queryParameters.page = 1;
    this.loadComments(this.hotelId);
  }

  addComment(newComment:Comment):void{
    this.commentService.postCommentAPI(newComment).subscribe(()=>{
      this.loadComments(this.hotelId);
    })
  }

  //切換分頁-下一頁
  nextPage():void{
    if(this.queryParameters.page * this.queryParameters.pageSize < this.totalItems){
      this.queryParameters.page++;
      this.loadComments(this.hotelId);
    }
  }

  //切換分頁-上一頁
  prevPage():void{
    if(this.queryParameters.page > 1){
        this.queryParameters.page--;
        this.loadComments(this.hotelId);
    }
  }

  setPage(page: number): void {
    this.queryParameters.page = page;
    this.loadComments(this.hotelId);
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  // filterByRating(event: Event): void {
  //   const target = event.target as HTMLSelectElement;
  //   const ratingFilter = Number(target.value); // 將字串轉換為數字
  //   this.queryParameters.ratingFilter = ratingFilter;
  //   this.queryParameters.page = 1;
  //   this.loadComments(this.hotelId);
  // }

  //todo 調整日期方法
  filterByDate(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const dateFilter = target.value;
    this.queryParameters.dateFilter = dateFilter;
    this.queryParameters.page = 1;
    this.loadComments(this.hotelId);
  }

  filterByTopic(topic: string): void {
    this.queryParameters.search = topic;
    this.queryParameters.page = 1;
    this.loadComments(this.hotelId);
  }

  sortBy(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const sortOrder = target.value;
    this.queryParameters.sortOrder = sortOrder;
    this.queryParameters.page = 1; // 重置頁碼為第一頁
    this.loadComments(this.hotelId);
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.queryParameters.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }




  //to do 6.5繼續
//   const counts = GetRatingCounts(query);
// this.rateCounts.clear();
// for (const [key, value] of Object.entries(counts)) {
//   this.rateCounts.set(Number(key), value);
// }






}
