
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { faCalculator, faHeart, faLocationDot, faWifi } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmileWink } from '@fortawesome/free-solid-svg-icons';
import { faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommentRequest, Commentdata, RatingScoreDTO } from '../model/comment';
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


export class MembercommentformComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: false }) container: ElementRef | undefined;

  commentRequest: CommentRequest = {
    CommentID: 0,
    RoomID: 0,
    ComfortScore: 0,
    CleanlinessScore: 0,
    StaffScore: 0,
    FacilitiesScore: 0,
    ValueScore: 0,
    LocationScore: 0,
    FreeWifiScore: 0,
    TravelerType: '',
  };

  faHeart = faHeart;
  fafacesmilewink = faFaceSmileWink;
  faspraycansparkles = faSprayCanSparkles;
  fauserlarge = faUserLarge;
  facouch = faCouch;
  faCalculator = faCalculator;
  faLocationdot = faLocationDot;
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

  UpdatedAt: string = '';

  hotelName: string = '';
  roomtypeName: string = '';
  checkinDate: string = '';
  checkoutDate: string = '';
  roomId: number = 0;
  commentStatus: string = '';

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
    { controlName: 'commentTitle', label: '評論標題', icon: null },
    { controlName: 'commentText', label: '評論內容', icon: null },
  ];


  constructor(private route: ActivatedRoute, private http: HttpClient, private commentService: CommentService) { }

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
      console.log('Received parameters:', this.commentID, this.hotelName, this.roomtypeName, this.checkinDate, this.checkoutDate, this.roomId);
    });

    // 從 sessionStorage 恢復表單數據
    const savedFormData = sessionStorage.getItem('commentForm');
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      this.commentID = formData.commentID;
      this.commentTitle = formData.commentTitle;
      this.commentText = formData.commentText;
      this.roomId = formData.roomId;
      this.comfortScore = formData.comfortScore;
      this.cleanlinessScore = formData.cleanlinessScore;
      this.staffScore = formData.staffScore;
      this.facilitiesScore = formData.facilitiesScore;
      this.valueScore = formData.valueScore;
      this.locationScore = formData.locationScore;
      this.freeWifiScore = formData.freeWifiScore;
      this.travelerType = formData.travelerType;
    }

  }



  ngOnDestroy(): void {
    // 保存表單數據到 sessionStorage
    const formData = {
      commentID: this.commentID,
      commentTitle: this.commentTitle,
      commentText: this.commentText,
      roomId: this.roomId,
      comfortScore: this.comfortScore,
      cleanlinessScore: this.cleanlinessScore,
      staffScore: this.staffScore,
      facilitiesScore: this.facilitiesScore,
      valueScore: this.valueScore,
      locationScore: this.locationScore,
      freeWifiScore: this.freeWifiScore,
      travelerType: this.travelerType
    };
    sessionStorage.setItem('commentForm', JSON.stringify(formData));
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
    const isFormComplete = this.isFormComplete();
    const commentRequest = {
      CommentID: this.commentID,
      RoomID: this.roomId,
      ComfortScore: this.comfortScore,
      CleanlinessScore: this.cleanlinessScore,
      StaffScore: this.staffScore,
      FacilitiesScore: this.facilitiesScore,
      ValueScore: this.valueScore,
      LocationScore: this.locationScore,
      FreeWifiScore: this.freeWifiScore,
      TravelerType: this.travelerType,
      UpdatedAt: this.UpdatedAt,
    };

    console.log('Form Data:', commentRequest);

    this.commentService.addComment(commentRequest).subscribe(response => {
      console.log('Data submitted successfully', response);
    }, error => {
      console.error('Error submitting data', error);
    });

    const updateRequest = {
      CommentTitle: this.commentTitle,
      CommentText: this.commentText,
      CommentStatus: isFormComplete ? '7' : '6',

    };
    console.log('Form Data:', updateRequest);
    this.commentService.updateComment(this.commentID, updateRequest).subscribe(response => {
      console.log('Comment status updated successfully', response);
    }, error => {
      console.error('Error updating comment status', error);
    });

    // 清除 sessionStorage 中保存的表單數據
    sessionStorage.removeItem('commentForm');
  }


  isFormComplete(): boolean {
    return (
      this.commentTitle.trim() !== '' &&
      this.commentText.trim() !== '' &&
      this.roomId != null &&
      this.comfortScore != null &&
      this.cleanlinessScore != null &&
      this.staffScore != null &&
      this.facilitiesScore != null &&
      this.valueScore != null &&
      this.locationScore != null &&
      this.freeWifiScore != null &&
      this.travelerType.trim() !== ''
    );
  }











}






























