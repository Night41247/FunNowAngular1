
import { Component, ElementRef, ViewChild  } from '@angular/core';

import { faCalculator, faHeart, faLocationDot, faWifi } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmileWink } from '@fortawesome/free-solid-svg-icons';
import { faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { RatingScoreDTO } from '../model/comment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IconProp } from '@fortawesome/fontawesome-svg-core';


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


  fieldsMoved = new Set<string>();
  currentFieldIndex: number = -1;

  displayedFieldsCount: number = 0;

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


  constructor(private http: HttpClient) {}

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
  const ratingData: RatingScoreDTO = {
    ratingId: 0,
    commentId: 0,
    comfortScore: this.comfortScore,
    cleanlinessScore: this.cleanlinessScore,
    staffScore: this.staffScore,
    facilitiesScore: this.facilitiesScore,
    valueScore: this.valueScore,
    locationScore: this.locationScore,
    freeWifiScore: this.freeWifiScore,
    travelerType: this.travelerType,
    commentTitle: this.commentTitle,
    commentText: this.commentText
  };

  console.log('Form Data:', ratingData);

  this.http.post('YOUR_API_ENDPOINT', ratingData).subscribe(response => {
    console.log('Data submitted successfully', response);
  }, error => {
    console.error('Error submitting data', error);
  });
}















}
