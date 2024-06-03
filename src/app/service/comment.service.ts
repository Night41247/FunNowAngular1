import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentQueryParameters } from '../interface/CommentQueryParameters';


@Injectable({
  providedIn: 'root'
})
export class CommentService {


private apiUrl = 'https://localhost:7103/api/Comment/GetComment';

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

  return this.client.get<any>(this.apiUrl,{params:queryParas})
}

postCommentAPI(comment: Comment):Observable<any>{
  return this.client.post(this.apiUrl , comment);
}


}
