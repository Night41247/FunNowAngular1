export class Comment {
  commentId: number = 0;
  hotelId: number = 0;
  memberId: number = 0;
  createdAt: Date = new Date();
  commentTitle: string = '';
  commentText: string = '';
  commentStatus: string = '';
  isReported: boolean = false;
  updatedAt: Date = new Date();
  ratingScores?: RatingScore[] = [];
}

export class RatingScore {
  ratingId: number = 0;
  commentId: number = 0;
  roomId: number = 0;
  comfortScore: number = 0;
  cleanlinessScore: number = 0;
  staffScore: number = 0;
  facilitiesScore: number = 0;
  valueScore: number = 0;
  locationScore: number = 0;
  freeWifiScore: number = 0;
  travelerType: string = '';
}

export class CommentQueryParameters {
  page: number = 1;
  pageSize: number = 10;
  search?: string;
  ratingFilter: number = 0;
  dateFilter?: string;
  sortOrder!: string;
}
