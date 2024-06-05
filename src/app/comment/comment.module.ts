import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { CommentService } from '../service/comment.service';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: CommentComponent }
];

@NgModule({
  declarations: [
    CommentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  providers:[CommentService],
  exports:[
    CommentComponent
  ]
})
export class CommentModule {


 }
