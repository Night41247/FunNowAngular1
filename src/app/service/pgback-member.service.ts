import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchParametersDTO } from '../interface/SearchParametersDTO';
import { pgBackMemberDTO } from '../interface/pgBackMemberDTO';
import { CPaging } from '../interface/CPaging';

@Injectable({
  providedIn: 'root'
})
export class PgbackMemberService {

  constructor(private client:HttpClient) { }

  callShowAllMemberAPI(searchParams: SearchParametersDTO){
    return this.client.post<CPaging<pgBackMemberDTO>>('https://localhost:7103/api/pgBackMember/showAllMember', searchParams);
  }
  callShowNormalMemberAPI(searchParams: SearchParametersDTO){
    return this.client.post<CPaging<pgBackMemberDTO>>('https://localhost:7103/api/pgBackMember/showNormalMember', searchParams);
  }
  callShowBlockedMemberAPI(searchParams: SearchParametersDTO){
    return this.client.post<CPaging<pgBackMemberDTO>>('https://localhost:7103/api/pgBackMember/showBlockedMember', searchParams);
  }
  callShowMemberContainsKeywordAPI(searchParams: SearchParametersDTO){
    return this.client.post<CPaging<pgBackMemberDTO>>('https://localhost:7103/api/pgBackMember/showMemberContainsKeyword', searchParams);
  }
  callUpdateMemberRoleAPI(memberId: number, newRole: string){
    return this.client.put('https://localhost:7103/api/pgBackMember/updateMemberRole', { memberId, newRole });
  }


}
