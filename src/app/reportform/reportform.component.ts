import { Component } from '@angular/core';



interface Title {
  value: string;
  viewValue: string;
}

interface Subtitle {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-reportform',
  templateUrl: './reportform.component.html',
  styleUrls: ['./reportform.component.css']
})
export class ReportformComponent {
  constructor() {}

  selectedSubtitles: Subtitle[] = [];
  selectedSubtitle: string = '';
  selectedTitle: string = '';

  titles: Title[] = [
    { value: 'order', viewValue: '訂單相關' },
    { value: 'finance', viewValue: '財務與帳單' },
    { value: 'business', viewValue: '商務與產品相關' },
    { value: 'contract', viewValue: '加入FunNow或終止合約' }
  ];

  ordersubtitles: Subtitle[] = [
    { value: '1', viewValue: '住客評語' },
    { value: '2', viewValue: '訂單相關' },
    { value: '3', viewValue: '顧客不當行為' }
  ];

  financesubtitles: Subtitle[] = [
    { value: '1', viewValue: '收費相關客訴' },
    { value: '2', viewValue: '佣金' },
    { value: '3', viewValue: '未付款導致暫時關閉' },
    { value: '4', viewValue: '延遲付款' },
    { value: '5', viewValue: '退款' }
  ];

  productsubtitles: Subtitle[] = [
    { value: '1', viewValue: '條款與條件' },
    { value: '2', viewValue: '商業表現' },
    { value: '3', viewValue: '錯誤或技術性問題' }
  ];

  contractsubtitles: Subtitle[] = [
    { value: '1', viewValue: '無法終止合約' },
    { value: '2', viewValue: '無法在FunNow接受預訂' },
    { value: '3', viewValue: '被FunNow終止合約' }
  ];

  onTitleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const title = selectElement.value;
    console.log('Selected Title:', title); // 調試日誌
    switch (title) {
      case 'order':
        this.selectedSubtitles = this.ordersubtitles;
        break;
      case 'finance':
        this.selectedSubtitles = this.financesubtitles;
        break;
      case 'business':
        this.selectedSubtitles = this.productsubtitles;
        break;
      case 'contract':
        this.selectedSubtitles = this.contractsubtitles;
        break;
      default:
        this.selectedSubtitles = [];
        break;
    }
    console.log('Updated Subtitles:', this.selectedSubtitles); // 調試日誌

    // 如果有副標題選項,將 selectedSubtitle 設置為第一個選項
    if (this.selectedSubtitles.length > 0) {
      this.selectedSubtitle = this.selectedSubtitles[0].value;
    } else {
      this.selectedSubtitle = '';
    }
  }
  onTitleChangeshort(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedTitle = selectElement.value;
  }

}




