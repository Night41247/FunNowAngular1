import { Component } from '@angular/core';
import { CommentService } from './../service/comment.service';
import { CommentInfo, Commentsdata, OrderDetaileDTO } from '../model/comment';
import { Router } from '@angular/router';


interface RatingScoreDTO {
  ratingId: number;
  commentId: number;
  comfortScore: number;
  cleanlinessScore: number;
  staffScore: number;
  facilitiesScore: number;
  valueScore: number;
  locationScore: number;
  freeWifiScore: number;
  travelerType: string;
}


@Component({
  selector: 'app-member-comment',
  templateUrl: './member-comment.component.html',
  styleUrls: ['./member-comment.component.css']
})
export class MemberCommentComponent {

  comments: Commentsdata[] = [];
  commentInfos: CommentInfo[] = [];
  combinedComments: any[] = [];
  orders:OrderDetaileDTO[]=[];
  unfinishedComments: any[] = [];
  pendingComments: any[] = [];
  completedComments: any[] = [];
  hotelImage:any[]=[];

  constructor(private commentService: CommentService,private router: Router) { }




  ngOnInit(): void {
    const memberId = 20; // TODO 先写死

    this.commentService.getCommentsByStatus(memberId).subscribe(

      (data) => {
        this.comments = data.comments;
        this.commentInfos = data.commentinfo;
        this.orders = data.orders;
        this.hotelImage = data.hotelImage;
        // 合并评论和评论信息
        this.combinedComments = this.comments.map(comment => {
          const info = this.commentInfos.find(ci => ci.commentId === comment.commentId);
          const order = this.orders.find(o => o.memberId === comment.memberId);
          const nights = order ? this.calculateNights(order.checkInDate, order.checkOutDate) : null;
          const image = this.hotelImage.find(h => h.hotelId === comment.hotelId)
          return {
            ...comment,
            ...info,
            ...order,
            ...image,
            checkInDate: order ? order.checkInDate : null,
            checkOutDate: order ? order.checkOutDate : null,
            nights

          };
        });
        console.log(data);
        console.log(this.combinedComments);
        this.unfinishedComments = this.combinedComments.filter(comment => comment.commentStatus === '6');
        this.pendingComments = this.combinedComments.filter(comment => comment.commentStatus === '5');
        this.completedComments = this.combinedComments.filter(comment => comment.commentStatus === '7');
        sessionStorage.setItem('unfinishedComments', JSON.stringify(this.unfinishedComments));
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  startReview(commentID: number, hotelName: string, roomtypeName: string, checkinDate: string, checkoutDate: string,roomId:number): void {
    this.router.navigate(['/membercommentform', commentID], {
      queryParams: {
        hotelName: hotelName,
        roomtypeName: roomtypeName,
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        roomId:roomId,
      }
    });
    console.log(commentID);
  }




  private calculateNights(checkInDate: Date, checkOutDate: Date): number {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

}
