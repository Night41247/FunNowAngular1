import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentQueryParameters } from '../model/comment';


@Injectable({
  providedIn: 'root'
})
export class CommentService {


private apiUrl = 'https://localhost:7103/api/Comment/2/Getcomments?page=1&pageSize=10';
//  params = {
//   page: 1,
//   pageSize: 10,
//   search: null,
//   ratingFilter: null, // 這裡設置評分過濾參數
//   dateFilter: null // 這裡設置日期過濾參數
// };

constructor(private client:HttpClient) { }

getComments(hotelId: number, page: number, pageSize: number, search: string | undefined, ratingFilter: number | null, dateFilter: string | undefined): Observable<any> {
  const url = `${this.apiUrl}/${hotelId}/Getcomments?page=${page}&pageSize=${pageSize}&search=${search}&ratingFilter=${ratingFilter}&dateFilter=${dateFilter}`;
  return this.client.get<any>(url);
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
  return this.client.post(this.apiUrl , comment);
}



}
