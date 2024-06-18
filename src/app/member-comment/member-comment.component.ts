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
    const memberId = 1; // TODO 先写死

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
          const image = this.hotelImage.find(h => h.hotelId === comment.hotelId);

          const processedImage = image ? this.processImageUrl(image.imageUrl) : null;
          console.log('Processed Image URL:', processedImage);
          return {
            ...comment,
            ...info,
            ...order,
            imageUrl: processedImage,
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

  private processImageUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // 處理網路圖片
      return url;
    } else {
      // 本地圖片
      return `/image/${url}`;
    }
  }

  startReview(commentID: number, hotelName: string, roomtypeName: string, checkinDate: string, checkoutDate: string, roomId: number): void {
    const formattedCheckinDate = new Date(checkinDate).toISOString().split('T')[0];
    const formattedCheckoutDate = new Date(checkoutDate).toISOString().split('T')[0];

    const nights = this.calculateNights(new Date(formattedCheckinDate), new Date(formattedCheckoutDate));
    console.log(`Number of nights: ${nights}`);

    this.router.navigate(['/membercommentform'], {
      queryParams: {
        commentID: commentID,
        hotelName: hotelName,
        roomtypeName: roomtypeName,
        checkinDate: formattedCheckinDate,
        checkoutDate: formattedCheckoutDate,
        roomId: roomId,
      }
    }).then(success => {
      if (success) {
        console.log('Navigation is successful!');
      } else {
        console.error('Navigation has failed!');
      }
    }).catch(err => {
      console.error('Navigation error:', err);
    });

    console.log(commentID);
  }
  private calculateNights(checkInDate: Date | string, checkOutDate: Date | string): number {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

}
