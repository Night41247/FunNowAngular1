

export class CommentQueryParameters {
  page: number = 1;
  pageSize: number = 10;
  search?: string;
  ratingFilter: number = 0;
  dateFilter?: string;
  sortOrder!: string;

  ratingId: number = 0;
  roomId: number = 0;
  comfortScore: number = 0;
  cleanlinessScore: number = 0;
  staffScore: number = 0;
  facilitiesScore: number = 0;
  valueScore: number = 0;
  locationScore: number = 0;
  freeWifiScore: number = 0;
  travelerType: string = '';

  commentId: number = 0;
  hotelId: number = 0;
  memberId: number = 0;
  createdAt: Date = new Date();
  commentTitle: string = '';
  commentText: string = '';
  commentStatus: string = '';
  isReported: boolean = false;
  updatedAt: Date = new Date();

}

export interface Score {
  key: string;
  value: number;
}

export interface Commentsdata {
  commentId: number;
  commentStatus: string; // 确保这个字段是 string 类型
  commentText: string;
  commentTitle: string;
  commentTravelerTypes: any[];
  createdAt: string;
  hotel: any;
  hotelId: number;
  hotelName:string;
  isReported: boolean;
  member: any;
  memberId: number;
  orderId: number;
  ratingScores: any[];
  reportReviews: any[];
  updatedAt: string;
  hotelAddress:string;
  TravelerType:string;
  RoomTypeName:string;
}

export interface CommentInfo {
  commentId: number;
  firstName: string;
  travelerType: string;
  roomTypeName: string;
}

export interface RatingScoreDTO {
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

export interface OrderDetaileDTO {
  orderDetailId: number;
  memberId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  createdAt: number;
  isOrdered: number;
}

export interface HotelImage {
  hotelImagee:string;
}
