import { ReportDetailDialogComponent } from './../report-detail-dialog/report-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';

import { faCalculator, faHeart, faLocationDot, faWifi } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmileWink } from '@fortawesome/free-solid-svg-icons';
import { faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
import { faUserLarge } from '@fortawesome/free-solid-svg-icons';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommentRequest, Commentdata, RatingScore, RatingScoreDTO } from '../model/comment';
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
  // @ViewChild('container', { static: false }) container: ElementRef | undefined;
  @ViewChildren('commentItem') commentItems!: QueryList<ElementRef>;
  // @ViewChildren('scrollTarget') scrollTargets: QueryList<ElementRef> | undefined;

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



  @Input() commentId!: number;
  @Input() hotelName!: string;
  @Input() roomtypeName!: string;
  @Input() checkinDate!: string;
  @Input() checkoutDate!: string;
  @Input() roomId!: number;
  @Input() memberId!: number;
  @Input() nights!: number;

  commentStatus: string = '';
  fieldsMoved = new Set<string>();
  currentFieldIndex: number = -1;
  displayedFieldsCount: number = 0;

  UpdatedAt: string = '';
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


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private commentService: CommentService,
    private renderer: Renderer2,
    private dialog: MatDialog
  ) {  }

  ngOnInit(): void {

      // 使用这些参数进行其他初始化操作
      console.log('Received parameters:', {
        commentId: this.commentId,
        hotelName: this.hotelName,
        roomtypeName: this.roomtypeName,
        checkinDate: this.checkinDate,
        checkoutDate: this.checkoutDate,
        roomId: this.roomId,
        memberId: this.memberId,
        nights: this.nights
      });

    //背景
    this.initBlobs();
  }

 // 從 sessionStorage 恢復表單數據
    // const savedFormData = sessionStorage.getItem('commentForm');
    // if (savedFormData) {
    //   const formData = JSON.parse(savedFormData);
    //   this.commentID = formData.commentID;
    //   this.commentTitle = formData.commentTitle;
    //   this.commentText = formData.commentText;
    //   this.roomId = formData.roomId;
    //   this.comfortScore = formData.comfortScore;
    //   this.cleanlinessScore = formData.cleanlinessScore;
    //   this.staffScore = formData.staffScore;
    //   this.facilitiesScore = formData.facilitiesScore;
    //   this.valueScore = formData.valueScore;
    //   this.locationScore = formData.locationScore;
    //   this.freeWifiScore = formData.freeWifiScore;
    //   this.travelerType = formData.travelerType;
    // }

  ngOnDestroy(): void {
    // 保存表單數據到 sessionStorage
    const formData = {
      commentID: this.commentId,
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

  }
  onSliderChange(controlName: string): void {
    const currentFieldIndex = this.fields.findIndex(field => field.controlName === controlName);
    if (currentFieldIndex >= this.displayedFieldsCount - 1 && this.displayedFieldsCount < this.fields.length) {
      this.displayedFieldsCount++;
      this.scrollToCurrentField();

    }
  }

  ngAfterViewInit(): void {
    this.scrollToCurrentField();
  }

  scrollToCurrentField(): void {
    if (this.displayedFieldsCount > 0 && this.displayedFieldsCount <= this.commentItems.length) {
      setTimeout(() => {
        const currentItem = this.commentItems.toArray()[this.displayedFieldsCount - 1];
        const rect = currentItem.nativeElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const fixedPosition = rect.top + scrollTop - (window.innerHeight / 2) + (currentItem.nativeElement.offsetHeight / 2);
        window.scrollTo({
          top: fixedPosition,
          behavior: 'smooth'
        });
      }, 0);
    }
  }


  onSubmit(): void {
    const isFormComplete = this.isFormComplete();
    const ratingScore: RatingScore = {
      commentId: this.commentId,
      roomId: this.roomId,
      comfortScore: this.comfortScore,
      cleanlinessScore: this.cleanlinessScore,
      staffScore: this.staffScore,
      facilitiesScore: this.facilitiesScore,
      valueScore: this.valueScore,
      locationScore: this.locationScore,
      freeWifiScore: this.freeWifiScore,
      travelerType: this.travelerType,
    };

    console.log('Form Data:', ratingScore);

    this.commentService.addComment(ratingScore).subscribe(response => {
      console.log('Data submitted successfully', response);
    }, error => {
      console.error('Error submitting data', error);
    });

    const updateRequest = {
      CommentTitle: this.commentTitle,
      CommentText: this.commentText,
      CommentStatus: isFormComplete ? '7' : '6',

    };
    console.log('updateRequest Form Data:', updateRequest);
    this.commentService.updateComment(this.commentId, updateRequest).subscribe(response => {
      console.log('Comment status updated successfully', response);
    }, error => {
      console.error('Error updating comment status', error);
    });

    // 清除 sessionStorage 中保存的表單數據
    sessionStorage.removeItem('commentForm');
    this.showSuccessDialog();

  }

  showSuccessDialog(): void {
    this.dialog.open(ReportDetailDialogComponent, {
      data: {
        dialogType: 'confirmdialog'
      }
    });
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








  // 背景

  private readonly MIN_SPEED = 1.5;
  private readonly MAX_SPEED = 2.5;

  private randomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private initBlobs() {
    const blobEls = document.querySelectorAll('.bouncing-blob');
    const blobs = Array.from(blobEls).map(blobEl => new this.Blob(blobEl as HTMLElement, this.randomNumber.bind(this), this.renderer));

    const update = () => {
      requestAnimationFrame(update);
      blobs.forEach(blob => {
        blob.update();
        blob.move();
      });
    };

    requestAnimationFrame(update);
  }

  private Blob = class {
    private el: HTMLElement;
    private size: number;
    private initialX: number;
    private initialY: number;
    private vx: number;
    private vy: number;
    private x: number;
    private y: number;

    constructor(el: HTMLElement, private randomNumber: (min: number, max: number) => number, private renderer: Renderer2) {
      this.el = el;
      const boundingRect = this.el.getBoundingClientRect();
      this.size = boundingRect.width;
      this.initialX = this.randomNumber(0, window.innerWidth - this.size);
      this.initialY = this.randomNumber(0, window.innerHeight - this.size);
      this.renderer.setStyle(this.el, 'top', `${this.initialY}px`);
      this.renderer.setStyle(this.el, 'left', `${this.initialX}px`);
      this.vx = this.randomNumber(1.5, 2.5) * (Math.random() > 0.5 ? 1 : -1);
      this.vy = this.randomNumber(1.5, 2.5) * (Math.random() > 0.5 ? 1 : -1);
      this.x = this.initialX;
      this.y = this.initialY;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x >= window.innerWidth - this.size) {
        this.x = window.innerWidth - this.size;
        this.vx *= -1;
      }
      if (this.y >= window.innerHeight - this.size) {
        this.y = window.innerHeight - this.size;
        this.vy *= -1;
      }
      if (this.x <= 0) {
        this.x = 0;
        this.vx *= -1;
      }
      if (this.y <= 0) {
        this.y = 0;
        this.vy *= -1;
      }
    }

    move() {
      this.renderer.setStyle(this.el, 'transform', `translate(${this.x - this.initialX}px, ${this.y - this.initialY}px)`);
    }
  };







}






























