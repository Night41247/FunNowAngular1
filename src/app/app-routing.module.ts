import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelCommentComponent } from './hotel-comment/hotel-comment.component';
import { CommentComponent } from './comment/comment.component';
import { PlatformCommentComponent } from './platform-comment/platform-comment.component';



const routes: Routes = [
  { path: '/comment', component: CommentComponent },
  { path: '/platformcomment', component: PlatformCommentComponent },
  { path: '/hotel_comment', component: HotelCommentComponent }, //其他人接過來要這樣設定
  { path: '/comment_list', loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule) }, //評論自己另外設定
  { path: '', redirectTo: '/comment', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
