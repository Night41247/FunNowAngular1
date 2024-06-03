import { CommentService } from './../service/comment.service';
import { Component, Input, OnInit } from '@angular/core';
import { Comment, CommentQueryParameters } from '../model/comment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit{

  private hotelId = 2;

  @Input()hotelName!: string;





  //評論
  comments:Comment[] = [];
  totalItems:number = 0;
  averageScores: any = {};
  //確定屬性會在使用前初始化，可以使用!非空斷言運算符來告訴TypeScript編譯器
  //或提供默認值  totalAverageScore: number = 0;
  totalAverageScore: number = 0;
  queryParameters:CommentQueryParameters = new CommentQueryParameters();
  isSearchVisible: boolean = false;

  constructor(private commentService: CommentService ){}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void{
    this.commentService.getCommentAPI(this.queryParameters).subscribe(data =>{
        this.comments = data.comments;
        this.totalItems = data.TotalItems;
        this.averageScores = data.AverageScores;
        this.totalAverageScore = data.TotalAverageScore;
    });

  }

  searchComments():void{
    this.queryParameters.page = 1;
    this.loadComments();
  }

  addComment(newComment:Comment):void{
    this.commentService.postCommentAPI(newComment).subscribe(()=>{
      this.loadComments();
    })
  }

  //切換分頁-下一頁
  nextPage():void{
    if(this.queryParameters.page * this.queryParameters.pageSize < this.totalItems){
      this.queryParameters.page++;
      this.loadComments();
    }
  }

  //切換分頁-上一頁
  prevPage():void{
    if(this.queryParameters.page > 1){
        this.queryParameters.page--;
        this.loadComments();
    }
  }

  setPage(page: number): void {
    this.queryParameters.page = page;
    this.loadComments();
  }

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }

  filterByRating(event:Event):void{
    const target = event.target as HTMLSelectElement;
    const rating = target?.value ? +target.value : 0;
    this.commentService.filterByRating(rating)
    .subscribe(comments => {
      this.comments = comments;
    });
    this.loadComments();
  }

  //todo 調整日期方法
  filterByDate(event: Event): void {
    const target = event.target as HTMLSelectElement;
  const dateFilter = target?.value || '';
  this.commentService.getMonthFilter(dateFilter).subscribe(month => {
    // 在這裡根據選擇的月份進行評論加載或篩選
    this.loadComments();
  });
  }

  filterByTopic(topic:string):void{
    this.queryParameters.search = topic;
    this.loadComments();
  }

  sortBy(event: Event):void{
    const target = event.target as HTMLSelectElement;
    const sortOrder = target?.value || 'latest';
    this.queryParameters.sortOrder = sortOrder;
    this.loadComments();
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.queryParameters.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }









}
