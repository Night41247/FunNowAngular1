import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { CommentService } from '../service/comment.service';



@NgModule({
  declarations: [
    CommentComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers:[CommentService],
  exports:[
    CommentComponent
  ]
})
export class CommentModule {


 }
