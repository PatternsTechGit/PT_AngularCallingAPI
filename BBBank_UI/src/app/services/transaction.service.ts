import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { lineGraphData } from '../models/line-graph-data';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private httpclient:HttpClient) { }
  getThreeYearsBalances(accountId :string): Observable<lineGraphData>{
  return this.httpclient.get<lineGraphData>(environment.apiUrlBase + 'Transaction/GetLast3MonthBalances/'+ accountId);

  }

}
