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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlatformCommentComponent } from './platform-comment/platform-comment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HotelCommentComponent,
    MemberCommentComponent,
    PgbackMemberComponent,
    PlatformCommentComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    CommentModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatChipsModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    NgFor,
    MatButtonModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
