import { Component, OnInit } from '@angular/core';
import { lineGraphData } from './models/line-graph-data';
import { TransactionService } from './services/transaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  title = 'BBBankUI';
  lineGraphData: lineGraphData;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService
      .GetLast12MonthBalances('37846734-172e-4149-8cec-6f43d1eb3f60')
      .subscribe({
        next: (data) => {
          this.lineGraphData = data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
