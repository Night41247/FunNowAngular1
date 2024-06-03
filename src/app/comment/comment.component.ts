import { CommentService } from './../service/comment.service';
import { Component, OnInit } from '@angular/core';
import { CommentQueryParameters } from '../interface/CommentQueryParameters';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent implements OnInit{

  //搜尋按鈕
  isSearchVisible: boolean = false;

  toggleSearch() {
    this.isSearchVisible = !this.isSearchVisible;
  }


  //評論
  comments:Comment[] = [];
  totalItems:number = 0;
  averageScores:any;
  //確定屬性會在使用前初始化，可以使用!非空斷言運算符來告訴TypeScript編譯器
  //或提供默認值  totalAverageScore: number = 0;
  totalAverageScore!: number;
  queryParameters:CommentQueryParameters = new CommentQueryParameters();

  constructor(private commentService: CommentService ){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }























}
