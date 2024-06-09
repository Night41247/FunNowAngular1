
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommentModule } from './comment/comment.module';
import { CommonModule } from '@angular/common';
import { HotelCommentComponent } from './hotel-comment/hotel-comment.component';
import { MemberCommentComponent } from './member-comment/member-comment.component';
import { PgbackMemberComponent } from './pgback-member/pgback-member.component';
import { PlatformCommentComponent } from './platform-comment/platform-comment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    HotelCommentComponent,
    MemberCommentComponent,
    PgbackMemberComponent,
    PlatformCommentComponent,
  ],
  imports: [
    FontAwesomeModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
