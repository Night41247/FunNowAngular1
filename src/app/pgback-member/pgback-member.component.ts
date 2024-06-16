import { Component } from '@angular/core';
import { pgBackMemberDTO } from '../interface/pgBackMemberDTO';
import { SearchParametersDTO } from '../interface/SearchParametersDTO';
import { PgbackMemberService } from '../service/pgback-member.service';
import { CPaging } from '../interface/CPaging';

//列舉
enum FilterCondition {
  AllMembers,
  NormalMembers,
  BlockedMembers,
  KeywordSearch
}

@Component({
  selector: 'app-pgback-member',
  templateUrl: './pgback-member.component.html',
  styleUrls: ['./pgback-member.component.css']
})
export class PgbackMemberComponent {

  arrayMember: pgBackMemberDTO[] = [];
  totalRecords: number = 0;
  selectedSortOption = 'nameDefault';

  searchKeyword = '';//雙向繫結
  searchPageNumber = 1;
  searchPageSize = 10;
  totalPages: number = 0; // 总页数
  searchPara: SearchParametersDTO = {//要傳給api的參數(類別)
    keyword: this.searchKeyword,
    pageNumber: this.searchPageNumber,
    pageSize: this.searchPageSize
  };

  currentFilter: FilterCondition = FilterCondition.AllMembers;


  constructor(private service: PgbackMemberService) { }
  ngOnInit(): void {
    this.showAllMember();
  }
  //根據狀態紐篩選出的資料, 再進一步做A-Z排序
  //1.狀態篩選紐
  showAllMember() {
    this.selectedSortOption = 'nameDefault';
    this.searchPara.pageNumber = this.searchPageNumber;
    this.searchPara.pageSize = this.searchPageSize;

    this.service.callShowAllMemberAPI(this.searchPara).subscribe((data: CPaging<pgBackMemberDTO>) => {
      this.arrayMember = data.data;
      this.totalRecords = data.totalRecords;
      this.totalPages = Math.ceil(this.totalRecords / this.searchPageSize);
    })
    this.currentFilter = FilterCondition.AllMembers;
  }
  showNormalMember() {
    this.selectedSortOption = 'nameDefault';
    this.searchPara.pageNumber = this.searchPageNumber;
    this.searchPara.pageSize = this.searchPageSize;

    this.service.callShowNormalMemberAPI(this.searchPara).subscribe((data: CPaging<pgBackMemberDTO>) => {
      this.arrayMember = data.data;
      this.totalRecords = data.totalRecords;
      this.totalPages = Math.ceil(this.totalRecords / this.searchPageSize);
    })
    this.currentFilter = FilterCondition.NormalMembers;
  }
  showBlockedMember() {
    this.selectedSortOption = 'nameDefault';
    this.searchPara.pageNumber = this.searchPageNumber;
    this.searchPara.pageSize = this.searchPageSize;

    this.service.callShowBlockedMemberAPI(this.searchPara).subscribe((data: CPaging<pgBackMemberDTO>) => {
      this.arrayMember = data.data;
      this.totalRecords = data.totalRecords;
      this.totalPages = Math.ceil(this.totalRecords / this.searchPageSize);
    })
    this.currentFilter = FilterCondition.BlockedMembers;
  }
  //2.A-Z排序下拉選單
  onSortChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;//先從EventTarget轉型成HTMLSelectElement
    this.selectedSortOption = selectElement.value;//=>才點得到value屬性(就是option的value)
    this.applySort();
  }
  applySort() {
    if (this.selectedSortOption === 'nameASC') {
      this.arrayMember.sort((a, b) => a.fullName.localeCompare(b.fullName));//localeCompare回傳0,1,負數=>sort再依此排序a和b
    } else if (this.selectedSortOption === 'nameDESC') {
      this.arrayMember.sort((a, b) => b.fullName.localeCompare(a.fullName));
    }
  }
  //關鍵字搜尋
  showMemberContainsKeyword() {
    this.searchPara.keyword = this.searchKeyword;
    this.searchPara.pageNumber = this.searchPageNumber;
    this.searchPara.pageSize = this.searchPageSize;

    this.service.callShowMemberContainsKeywordAPI(this.searchPara).subscribe((data) => {
      this.arrayMember = data.data;
      this.totalRecords = data.totalRecords;
      this.totalPages = Math.ceil(this.totalRecords / this.searchPageSize);
    })
    this.currentFilter = FilterCondition.KeywordSearch;
  }
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter')
      this.showMemberContainsKeyword();
  }
  //更改狀態紐
  setRoleColor(roleName: string): string {
    return roleName === '房客' ? 'green' : 'red';
  }
  popConfirmMsg(member: pgBackMemberDTO) {
    const confirmed = window.confirm(`確定要修改${member.fullName}的狀態嗎？`);
    if (confirmed) {
      this.changeRoleStatus(member);
    }
  }
  changeRoleStatus(member: pgBackMemberDTO) {
    const newRole = member.roleName === '房客' ? '封鎖中' : '房客';
    this.service.callUpdateMemberRoleAPI(member.memberId, newRole).subscribe(() => {
      member.roleName = newRole;
    });
  }
  //分頁紐
  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) {
      return; // 如果超出页数范围，则不处理
    }
    this.searchPageNumber = page;
    // 根据当前过滤条件调用相应的方法
    switch (this.currentFilter) {
      case FilterCondition.AllMembers:
        this.showAllMember();
        break;
      case FilterCondition.NormalMembers:
        this.showNormalMember();
        break;
      case FilterCondition.BlockedMembers:
        this.showBlockedMember();
        break;
      case FilterCondition.KeywordSearch:
        this.showMemberContainsKeyword();
        break;
      default:
        this.showAllMember();
        break;
    }
  }

  getPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }







}
