
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, throwError } from 'rxjs';
import { CommentInfo, CommentRequest, CommentUpdateRequest, Commentdata, Commentsdata, HotelImage, OrderDetaileDTO, RatingScore } from '../model/comment';
import { ContentModeratorClient } from '@azure/cognitiveservices-contentmoderator';
import { CognitiveServicesCredentials } from '@azure/ms-rest-azure-js';


@Injectable({
  providedIn: 'root'
})
export class CommentService {
  isLoading = false;
  private apiUrl = 'https://localhost:7103/api/Comment';

  //azure 內容仲裁金鑰、端點
  private endpoint = 'https://<your-endpoint>.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen';
  private apiKey = 'e857f822e05e4bc197c20b061366ee1d';
  private contentModeratorClient: ContentModeratorClient;


  constructor(private http:HttpClient) { const credentials = new CognitiveServicesCredentials(this.apiKey);
    this.contentModeratorClient = new ContentModeratorClient(credentials, this.endpoint);}

 /**
   * 獲取評論
   * @param hotelId 酒店ID
   * @param page 當前頁碼
   * @param pageSize 每頁顯示的評論數量
   * @param search 搜索關鍵字 (可選)
   * @param ratingFilter 評分篩選 (可選)
   * @param dateFilter 日期篩選 (可選)
   * @param sortBy 排序方式 (可選)
   *
   */

 getComments(hotelId: number, page: number, pageSize: number, search?: string, ratingFilter?: number, dateFilter?: string, sortBy?: string, topics?: string): Observable<any> {

  let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString())
    .set('hotelId', hotelId.toString()); // 添加hotelId參數

  if (search) {
    params = params.set('search', search);
  }
  if (ratingFilter) {
    params = params.set('ratingFilter', ratingFilter.toString());
  }
  if (dateFilter) {
    params = params.set('dateFilter', dateFilter);
  }
  if (sortBy) {
    params = params.set('sortBy', sortBy);
  }
  if (topics) {
    params = params.set('topics', topics);
  }

  console.log('Request Params:', params.toString());
  return this.http.get<any>(`${this.apiUrl}/${hotelId}/GetComments`, { params });
}





 /**
   * 獲取評論數量
   */
 getCommentCounts(hotelId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/commentCounts`, { params: new HttpParams().set('hotelId', hotelId.toString()) });
}
/**
   * 發佈評論
   * @param comment 評論對象
   */
postCommentAPI(comment: any): Observable<any> {
  return this.http.post(this.apiUrl, comment);
}




/**
 * 獲取評分平均
 * @param hotelId 酒店ID
 */
getAverageScores(hotelId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${hotelId}/AverageScores`);
}

//platform_comment(第三方審核檢舉表單)
getReportComment(filters: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/ReportedComment`, filters);
}

updateCommentStatus(commentId: number, status: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/UpdateCommentStatus`, { commentId, status });
}
updateCommentAndReportStatus(commentId: number, reportId: number, status: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/UpdateCommentStatus`, {
    commentId,
    reportId,
    status
  });
}



sendEmail(to: string, subject: string, body: string): Observable<any> {
  const emailRequest = { to, subject, body };
  return this.http.post(`https://localhost:7103/api/Email/SendMessage`, emailRequest);
}
submitReport(reportReview: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/SubmitReportReview`, reportReview);
}


getCommentsByStatus(memberId: number): Observable<{ commentinfo: CommentInfo[], comments: Commentsdata[] ,orders: OrderDetaileDTO[],hotelImage:HotelImage[]}> {
  return this.http.get<{ commentinfo: CommentInfo[], comments: Commentsdata[],orders: OrderDetaileDTO[], hotelImage:HotelImage[] }>(`${this.apiUrl}/GetCommentsByStatus/${memberId}`);
}

//未填寫評論，存入DB
addComment(Ratingscore: RatingScore): Observable<RatingScore> {
  return this.http.post<RatingScore>(`${this.apiUrl}/AddComment`, Ratingscore);
}

//修改comment後存入DB
updateComment(commentId: number, updateRequest: CommentUpdateRequest): Observable<any> {
  return this.http.put(`${this.apiUrl}/UpdateCommentStatus/${commentId}`, updateRequest);
}

getAvgTxt(hotelId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/AverageRatingText/${hotelId}`);
}


getHotelImage(): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}/GetCHotelUrl`);
}

getAVGscore(hotelId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${hotelId}/AverageScores`);
}




//azure內容仲裁
 moderateText(text: string): Observable<any> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': this.apiKey,
      'Content-Type': 'text/plain'
    });

    return this.http.post(this.endpoint, text, { headers: headers });
  }

  private commentDataSource = new BehaviorSubject<any>(null);
  currentCommentData = this.commentDataSource.asObservable();

  //從commemt element傳遞資料到report element
  changeCommentData(comment: any) {
    this.commentDataSource.next(comment);
  }


  getMemberInfo(memberID: number): Observable<any> {
    // 假设这是获取当前用户信息的API调用
    return this.http.get<any>(`https://localhost:7103/api/Members/searchByID?ID=${memberID}`);
  }


getHotelComment(hotelId:number):Observable<any>{
  return this.http.get<any>(`https://localhost:7103/api/Comment/${hotelId}/ForHotelComment`);
}


private memberIdSource = new BehaviorSubject<number>(0);
currentMemberId = this.memberIdSource.asObservable();
changeMemberId(memberId: number) {
  this.memberIdSource.next(memberId);
}

}













