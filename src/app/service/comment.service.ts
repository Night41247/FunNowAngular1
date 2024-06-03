import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment, CommentQueryParameters } from '../model/comment';


@Injectable({
  providedIn: 'root'
})
export class CommentService {


private apiUrl = 'https://localhost:7103/api/Comment';

constructor(private client:HttpClient) { }

getCommentAPI(paras:CommentQueryParameters): Observable<any>
{
  let queryParas = new HttpParams()
  .set('page', paras.page.toString())
  .set('pageSize' ,paras.pageSize.toString())
  .set('ratingFilter', paras.ratingFilter.toString());

  if(paras.search){
      queryParas = queryParas.set('search',paras.search);
  }
  if(paras.dateFilter){
    queryParas = queryParas.set('dateFilter', paras.dateFilter);
  }

  return this.client.get<any>(`${this.apiUrl}/CommentFilter`,{params:queryParas})
}



postCommentAPI(comment: Comment):Observable<any>{
  return this.client.post(this.apiUrl , comment);
}

filterByRating(ratingFilter: number): Observable<Comment[]> {
  const params = new HttpParams().set('ratingFilter', ratingFilter.toString());
  return this.client.get<Comment[]>(`${this.apiUrl}/ApplyRatingFilter`, { params });
}

getMonthFilter(dateFilter: string): Observable<number> {
  return this.client.get<number>(`${this.apiUrl}/GetMonthFilter`, {
    params: { dateFilter }
  });
}

}
