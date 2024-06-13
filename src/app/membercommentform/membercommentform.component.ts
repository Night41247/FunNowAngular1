
import { Component, ElementRef, ViewChild  } from '@angular/core';

import { faCalculator, faHeart, faLocationDot, faWifi } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmileWink } from '@fortawesome/free-solid-svg-icons';
import { faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Commentdata, RatingScoreDTO } from '../model/comment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from './../service/comment.service';

@Component({
  selector: 'app-membercommentform',
  templateUrl: './membercommentform.component.html',
  styleUrls: ['./membercommentform.component.css'],

})


export class MembercommentformComponent {
  @ViewChild('container', { static: false }) container: ElementRef | undefined;
  faHeart=faHeart;
  fafacesmilewink= faFaceSmileWink;
  faspraycansparkles = faSprayCanSparkles;
  fauserlarge = faUserLarge;
  facouch = faCouch;
  faCalculator = faCalculator;
  faLocationdot =faLocationDot;
  faWifi = faWifi;

  comfortScore = 0;
  cleanlinessScore = 0;
  staffScore = 0;
  facilitiesScore = 0;
  valueScore = 0;
  locationScore = 0;
  freeWifiScore = 0;
  travelerType = '';
  commentTitle = '';
  commentText = '';

  UpdatedAt :string = '';

  hotelName: string = '';
  roomtypeName: string = '';
  checkinDate: string = '';
  checkoutDate: string = '';
  roomId:number = 0;
  CommentStatus:string='';

  fieldsMoved = new Set<string>();
  currentFieldIndex: number = -1;

  displayedFieldsCount: number = 0;
  commentID: number = 0;

  fields = [
    { controlName: 'comfortScore', label: '舒適程度', icon: faFaceSmileWink as IconProp },
    { controlName: 'cleanlinessScore', label: '清潔程度', icon: faSprayCanSparkles as IconProp },
    { controlName: 'staffScore', label: '員工素質', icon: faUserLarge as IconProp },
    { controlName: 'facilitiesScore', label: '設施', icon: faCouch as IconProp },
    { controlName: 'valueScore', label: '性價比', icon: faCalculator as IconProp },
    { controlName: 'locationScore', label: '住宿地點', icon: faLocationDot as IconProp },
    { controlName: 'freeWifiScore', label: '免費WIFI', icon: faWifi as IconProp },
    { controlName: 'travelerType', label: '', icon: null },
    { controlName: 'commentTitle', label: '评论标题', icon: null },
    { controlName: 'commentText', label: '评论内容', icon: null },
  ];


  constructor(private route: ActivatedRoute,private http: HttpClient,private commentService : CommentService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.commentID = +params['commentID'];
    });

    this.route.queryParams.subscribe(params => {
      this.hotelName = params['hotelName'];
      this.roomtypeName = params['roomtypeName'];
      this.checkinDate = params['checkinDate'];
      this.checkoutDate = params['checkoutDate'];
      this.roomId = params['roomId'];

      // 使用这些参数进行其他初始化操作
      console.log('Received parameters:', this.commentID, this.hotelName, this.roomtypeName, this.checkinDate, this.checkoutDate,this.roomId);
    });
  }



formatLabel(value: number): string {
  return `${value}`;
}
startReview(): void {
  this.displayedFieldsCount = 1; // 开始评论，显示第一个评分项目
  setTimeout(() => this.scrollToBottom(), 0); // 滚动到底部
}
onSliderChange(controlName: string): void {
  const currentFieldIndex = this.fields.findIndex(field => field.controlName === controlName);
  if (currentFieldIndex >= this.displayedFieldsCount - 1 && this.displayedFieldsCount < this.fields.length) {
    this.displayedFieldsCount++;
    setTimeout(() => this.scrollToBottom(), 0); // 滚动到底部
  }
}

scrollToBottom(): void {
  if (this.container) {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }
}

onSubmit(): void {
  const commentRequest = {
    CommentID : this.commentID,
    CommentTitle: this.commentTitle,
    CommentText: this.commentText,
    RoomID: this.roomId,
    ComfortScore: this.comfortScore,
    CleanlinessScore: this.cleanlinessScore,
    StaffScore: this.staffScore,
    FacilitiesScore: this.facilitiesScore,
    ValueScore: this.valueScore,
    LocationScore: this.locationScore,
    FreeWifiScore: this.freeWifiScore,
    TravelerType: this.travelerType,
    UpdatedAt:this.UpdatedAt,
    CommentStatus:this.CommentStatus,

  };

  console.log('Form Data:', commentRequest);

  this.commentService.addComment(commentRequest).subscribe(response => {
    console.log('Data submitted successfully', response);
  }, error => {
    console.error('Error submitting data', error);
  });
}











}
















