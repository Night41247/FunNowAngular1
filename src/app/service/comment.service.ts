import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'https://localhost:7103/api/Comment';

  constructor(private http:HttpClient) { }

/**
   * 獲取評論
   * @param hotelId 酒店ID
   * @param page 當前頁碼
   * @param pageSize 每頁顯示的評論數量
   * @param search 搜索關鍵字 (可選)
   * @param ratingFilter 評分篩選 (可選)
   * @param dateFilter 日期篩選 (可選)
   */
getComments(hotelId: number, page: number, pageSize: number, search?: string, ratingFilter?: number, dateFilter?: string, sortBy?: string): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

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

  return this.http.get<any>(`${this.apiUrl}/${hotelId}/Getcomments`, { params });
}

 /**
   * 獲取評論數量
   * @param dateFilter 日期篩選 (可選)
   */
 getCommentCounts(dateFilter?: string): Observable<any> {
  let params = new HttpParams();
  if (dateFilter) {
    params = params.set('dateFilter', dateFilter);
  }
  return this.http.get<any>(`${this.apiUrl}/commentCounts`, { params });
}


/**
   * 根據評分篩選評論
   * @param hotelId 酒店ID
   * @param rating 評分
   * @param page 當前頁碼
   * @param pageSize 每頁顯示的評論數量
   */
getCommentsByRating(hotelId: number, rating: number, page: number, pageSize: number): Observable<any> {
  return this.getComments(hotelId, page, pageSize, undefined, rating);
}


/**
   * 發佈評論
   * @param comment 評論對象
   */
postCommentAPI(comment: Comment): Observable<any> {
  return this.http.post(this.apiUrl, comment);
}


getMonthCounts(): Observable<Map<string, number>> {
  return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/monthCounts`).pipe(
    map(data => {
      const counts = new Map<string, number>();
      for (const [key, value] of Object.entries(data)) {
        counts.set(key, value);
      }
      return counts;
    })
  );
}

getMonthRanges(): Observable<{ key: string, label: string }[]> {
  return this.http.get<{ key: string, label: string }[]>(`${this.apiUrl}/monthRanges`);
}











}
