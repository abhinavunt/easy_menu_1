import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.scss']
})
export class AdminPortalComponent implements OnInit {
  public tab: string = 'orders';
  public role: string = '';
  constructor(private service: CommonService) { }

  ngOnInit() {
    this.role = this.service.getUserRole();
  }

  clickOnTab(tab:string){
    this.tab = tab;
  }

}
