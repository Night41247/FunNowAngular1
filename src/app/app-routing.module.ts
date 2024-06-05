import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelCommentComponent } from './hotel-comment/hotel-comment.component';



const routes: Routes = [
  { path: '', redirectTo: '/hotel_comment', pathMatch: 'full' },
  { path: 'hotel_comment', component: HotelCommentComponent }, //其他人接過來要這樣設定
  { path: 'comment_list', loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule) } //蓉自己另外設定
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
