import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelCommentComponent } from './hotel-comment/hotel-comment.component';
import { CommentComponent } from './comment/comment.component';
import { PlatformCommentComponent } from './platform-comment/platform-comment.component';
import { ReportformComponent } from './reportform/reportform.component';



const routes: Routes = [
  { path: 'platformcomment', component: PlatformCommentComponent },
  { path: 'hotel_comment', component: HotelCommentComponent }, //其他人接過來要這樣設定
  { path: '', redirectTo: 'comment', pathMatch: 'full' }, //預設路由頁
  { path: 'reportform', component: ReportformComponent },
  { path: 'comment', component: CommentComponent },
  { path: 'membercommentform'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
