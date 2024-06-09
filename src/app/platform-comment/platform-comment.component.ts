import { Component } from '@angular/core';

import {createPopper} from '@popperjs/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-platform-comment',
  templateUrl: './platform-comment.component.html',
  styleUrls: ['./platform-comment.component.css']

})
export class PlatformCommentComponent {


  constructor() { }
  faUser = faUser;
  faHouse = faHouse;
  faFaceSmile = faFaceSmile;
  faComment = faComment;
  faChartLine = faChartLine;



  ngOnInit(): void {

  }




















}




