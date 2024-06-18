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
    this.loadCommentsAndImages(memberId);
  }

  loadCommentsAndImages(memberId: number): void {
    // 並行獲取評論數據和圖片數據
    this.commentService.getCommentsByStatus(memberId).subscribe(
      (commentData) => {
        this.comments = commentData.comments;
        this.commentInfos = commentData.commentinfo;
        this.orders = commentData.orders;

        this.commentService.getHotelImage().subscribe(
          (imageData) => {
            this.hotelImage = imageData;

            // 合併評論和圖片數據
            this.combineCommentsWithImages();
          },
          (error) => {
            console.error('Error fetching hotel images', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching comments', error);
      }
    );
  }

  private combineCommentsWithImages() {
    this.combinedComments = this.comments.map(comment => {
      const info = this.commentInfos.find(ci => ci.commentId === comment.commentId);
      const order = this.orders.find(o => o.memberId === comment.memberId);
      const nights = order ? this.calculateNights(order.checkInDate, order.checkOutDate) : null;
      const image = this.hotelImage.find(h => h.hotelId === comment.hotelId);

      return {
        ...comment,
        ...info,
        ...order,
        hotelImageUrl: image ? image.hotelImageUrl : null, // 使用 API 返回的圖片 URL
        checkInDate: order ? order.checkInDate : null,
        checkOutDate: order ? order.checkOutDate : null,
        nights
      };
    });

    console.log('Combined Comments with Images:', this.combinedComments);
    this.unfinishedComments = this.combinedComments.filter(comment => comment.commentStatus === '6');
    this.pendingComments = this.combinedComments.filter(comment => comment.commentStatus === '5');
    this.completedComments = this.combinedComments.filter(comment => comment.commentStatus === '7');
    sessionStorage.setItem('unfinishedComments', JSON.stringify(this.unfinishedComments));
  }

//-----------------------------------------------------------------------
  // getHotelImages() {
  //   this.commentService.getHotelImage().subscribe(
  //     (data: any) => {
  //       // 處理從服務獲取的數據
  //       console.log('Hotel Images:', data);
  //       this.hotelImage = data;
  //     },
  //     (error: any) => {
  //       // 處理錯誤
  //       console.error(error);
  //     }
  //   );

  // }

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
