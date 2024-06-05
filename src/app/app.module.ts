import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommentComponent } from './comment/comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentModule } from './comment/comment.module';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CommentListComponent } from './comment-list/comment-list.component';

const routes: Routes = [
  { path: 'hotel_comment', component: CommentComponent },
  { path: 'comment_list', component:  CommentListComponent},
  // { path: 'contact', component: ContactComponent},
  // ...
];
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    CommentModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
