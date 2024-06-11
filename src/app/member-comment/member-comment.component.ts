import { Component } from '@angular/core';
import { CommentService } from './../service/comment.service';
import { Commentsdata } from '../model/comment';


@Component({
  selector: 'app-member-comment',
  templateUrl: './member-comment.component.html',
  styleUrls: ['./member-comment.component.css']
})
export class MemberCommentComponent {

  comments: Commentsdata[] = [];
  unfinishedComments: Commentsdata[] = [];


  constructor(private commentService: CommentService) { }



  ngOnInit(): void {
    const memberId = 20; // TODO 先寫死

    this.commentService.getCommentsByStatus(memberId).subscribe(
      (data: Commentsdata[]) => {
        this.comments = data;
        console.log(data);
        this.unfinishedComments = this.comments.filter(comment => comment.commentStatus === "6");
        sessionStorage.setItem('unfinishedComments', JSON.stringify(this.unfinishedComments));
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
  }


  addNewComment(newComment: Comment): void {
    this.commentService.addComment(newComment).subscribe(
      (data: Commentsdata) => {
        console.log('Comment added successfully', data);
        // 重新获取评论以更新列表
        this.ngOnInit();
      },
      (error) => {
        console.error('Error adding comment', error);
      }
    );
  }


}
