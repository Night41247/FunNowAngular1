import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http:HttpClient) { }


private apiUrl = 'https://localhost:7103/api/Comment';
//  params = {
//   page: 1,
//   pageSize: 10,
//   search: null,
//   ratingFilter: null, // 這裡設置評分過濾參數
//   dateFilter: null // 這裡設置日期過濾參數
// };



getComments(hotelId: number, page: number, pageSize: number, search?: string, ratingFilter?: number, dateFilter?: string): Observable<any> {
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

  return this.http.get<any>(`${this.apiUrl}/${hotelId}/GetComments`, { params });
}

getCommentCounts(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/commentCounts`);
}
// getComments(hotelId: number, page: number = 1, pageSize: number = 10, search: string | null = null, ratingFilter: number | null = null, dateFilter: string | null = null): Observable<any> {
//   let params = new HttpParams()
//     .set('hotelId', hotelId.toString())
//     .set('page', page.toString())
//     .set('pageSize', pageSize.toString());


//   if (search) {
//     params = params.set('search', search);
//   }
//   if (ratingFilter) {
//     params = params.set('ratingFilter', ratingFilter);
//   }
//   if (dateFilter) {
//     params = params.set('dateFilter', dateFilter);
//   }

//   return this.client.get<any>(`${this.apiUrl}`, { params });
// }


postCommentAPI(comment: Comment):Observable<any>{
  return this.http.post(this.apiUrl , comment);
}



}
