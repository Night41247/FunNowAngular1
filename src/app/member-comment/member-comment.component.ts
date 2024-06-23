import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(
    private commentService: CommentService,private router: Router) { }


  commentID!: number;
  hotelName!: string;
  roomtypeName!: string;
  checkinDate!: string;
  checkoutDate!: string;
  roomId!: number;
  @Input() memberId: number = 0;
  @Output() navigateToForm = new EventEmitter<any>();


ngOnInit(): void {

  this.commentService.changeMemberId(this.memberId);
    this.commentService.getCommentsByStatus(this.memberId).subscribe(

      (data) => {
        this.comments = data.comments;
        this.commentInfos = data.commentinfo;
        this.orders = data.orders;
        this.hotelImage = data.hotelImage;
        // 合併評論和和評論內容
        this.combinedComments = this.comments.map(comment => {
          const info = this.commentInfos.find(ci => ci.commentId === comment.commentId);
          const order = this.orders.find(o => o.memberId === comment.memberId);
          const nights = order ? this.calculateNights(order.checkInDate, order.checkOutDate) : null;
          const image = this.hotelImage.find(h => h.hotelId === comment.hotelId);
          const hotelImageUrl = image
          ? `/dist/fun-now-angular1/assets/${image.hotelImage1}`
          : null;
          return {
            ...comment,
            ...info,
            ...order,
            hotelImageUrl,
            checkInDate: order ? order.checkInDate : null,
            checkOutDate: order ? order.checkOutDate : null,
            nights
          };
        });
        console.log('ng',data);
        console.log('ngcombine',this.combinedComments);
        console.log('Member ID:', this.memberId);
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

    const commentData = {
      commentID,
      hotelName,
      roomtypeName,
      checkinDate: formattedCheckinDate,
      checkoutDate: formattedCheckoutDate,
      roomId,
      memberId: this.memberId,
      nights
    };
   // alert(`Emitted event with data: ${JSON.stringify(commentData)}`);
    console.log('Emitted event with data:', commentData);
    this.navigateToForm.emit(commentData);

  }


  private calculateNights(checkInDate: Date | string, checkOutDate: Date | string): number {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }



}
