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
   */
getComments(hotelId: number, page: number, pageSize: number, search?: string): Observable<any> {
  let params = new HttpParams()
    .set('page', page.toString())
    .set('pageSize', pageSize.toString());

  if (search) {
    params = params.set('search', search);
  }

  return this.http.get<any>(`${this.apiUrl}/${hotelId}/GetComments`, { params });
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
   * @param ratingFilter 評分篩選
   */
getCommentsByRating(ratingFilter: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/commentsByRating`, {
    params: new HttpParams().set('ratingFilter', ratingFilter.toString())
  });
}

  /**
   * 根據月份篩選評論
   * @param dateFilter 日期篩選
   */
  getCommentsByDateRange(dateFilter: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/commentsByDateRange`, {
      params: new HttpParams().set('dateFilter', dateFilter)
    });
  }





 /**
   * 發佈評論
   * @param comment 評論對象
   */
 postCommentAPI(comment: any): Observable<any> {
  return this.http.post(this.apiUrl, comment);
}



/**
   * 獲取月份評論數量
   */
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

/**
   * 獲取月份範圍
   */
getMonthRanges(): Observable<{ key: string, label: string }[]> {
  return this.http.get<{ key: string, label: string }[]>(`${this.apiUrl}/monthRanges`);
}


 /**
   * 獲取評分平均
   * @param hotelId 酒店ID
   */
 getAverageScores(hotelId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${hotelId}/AverageScores`);
}





}








