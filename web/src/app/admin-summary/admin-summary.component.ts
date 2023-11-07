import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-admin-summary',
  templateUrl: './admin-summary.component.html',
  styleUrls: ['./admin-summary.component.scss']
})
export class AdminSummaryComponent implements OnInit {
  public selectedMonth = "0";
  public summary = {};
  public dataLoaded = false;
  public loaderFlag: boolean = false;

  constructor(private service: CommonService) { }

  ngOnInit() {
  }

  getSummary(){
    this.loaderFlag = true;
    this.service.getSummary(this.selectedMonth).then(responseList => {
        this.summary = {};
        this.summary['total_order'] = responseList[0]['total_orders'];
        this.summary['total_cash'] = responseList[1]['total_cash'];
        this.summary['total_card'] = responseList[2]['total_card'];
        this.summary['total_tip_cash'] = responseList[3]['total_tip_cash'];
        this.summary['total_tip_card'] = responseList[4]['total_tip_card'];
        this.dataLoaded = true;
        this.loaderFlag = false;
    }).catch((res: any) => {
      console.log(res);
      this.loaderFlag = false;
    });
  }

}
