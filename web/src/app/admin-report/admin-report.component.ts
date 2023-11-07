import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss']
})
export class AdminReportComponent implements OnInit {
  public orderList: any = [];
  public orignalItemList: any;
  public orderDetails: any;
  public showOrderDetails: boolean = false;
  public loaderFlag : boolean = false;
  public categoriesList = [];
  public totalItemsList = [];
  public selectedItemsList = [];
  public daysList = [];
  public selectedCategory : any = '';
  public selectedItem : any ;
  public itemCount : number = 1;
  public showAddItem: boolean = false;

  public totalCash: number = 0;
  public totalCard: number = 0;
  public employeeList = [];
  public totalTipCash: number = 0;
  public totalTipCard: number = 0;
  public selectedEmployee: string = '';
  public selectedWeek: string = '0';
  public selectedMonth: string = '0';
  public role: string = '';
  public fileName = '';
  

  constructor(private service: CommonService) { }

  ngOnInit() {

  }

  genrateReport(){
    this.loaderFlag = true;
    this.service.getReport(this.selectedWeek, this.selectedMonth).then(orders => {
      this.loaderFlag = false;
      this.orderList = orders;
      this.generateFileName();
      this.reset();
      this.getTotalIncome();
    }).catch((res: any) => {
      this.loaderFlag = false;
    });
  }

  generateFileName(){
    let year = new Date().getFullYear();
    this.fileName = 'Report_'+year+'_'+this.selectedMonth+'_'+'Week-'+this.selectedWeek;
  }

  exportReport(){
    let element = document.getElementById('report_table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName+'.xlsx');
  }

  getOrderString(items: any){
    let str = "";
    for(let i=0; i<items.length; i++){
      let tempStr = items[i].item + "($"+items[i].price+")"+" * "+items[i].count;
      str = str.concat(tempStr);
      if(i !== (items.length - 1)){
        str = str.concat(", ");
      }
    }
    return str;
  }

  showOrder(order: any){
    this.orignalItemList = JSON.parse(JSON.stringify(order.items));
    this.orderDetails = JSON.parse(JSON.stringify(order));
    if(this.orderDetails['tipAmount'] === 0){
      this.orderDetails['tipAmount'] = null;
    }
    this.showOrderDetails = true;
  }

  removeItem(i: any){
    this.orderDetails.total = this.orderDetails.total - (this.orderDetails.items[i].price * this.orderDetails.items[i].count);
    this.orderDetails.items.splice(i,1);
  }

  onSelectCategory(target: any){
    const tar = target as HTMLInputElement;
    const id = tar.value;
    this.selectedItemsList = [];
    this.selectedItem = undefined;
    for(let i=0; i<this.totalItemsList.length;i++){
      if(this.totalItemsList[i]['categoryId'] === id){
        this.selectedItemsList.push(this.totalItemsList[i]);
      }
    }
  }

  updateItemList(){
    let obj = {}
    obj['item'] = this.selectedItem.item;
    obj['price'] = this.selectedItem.price;
    obj['count'] = this.itemCount;
    this.orderDetails.total = this.orderDetails.total + (this.selectedItem.price * this.itemCount);
    this.orderDetails.items.push(obj);
    this.cancelAddItem();
  }

  cancelAddItem(){
    this.selectedItemsList = [];
    this.showAddItem = false;
    this.selectedCategory = '';
    this.itemCount = 1;
    this.selectedItem = undefined;
  }

  backToOrders(){
    this.cancelAddItem();
    this.showOrderDetails=false;
  }

  getState(state: any){
    if(state === 'complete'){
      return 'Completed';
    }else if(state === 'modified'){
      return 'Completed with Modifications';
    }else if(state === 'new'){
      return 'New';
    }
  }

  

  

  reset(){
    this.totalCash = 0;
    this.totalCard = 0;
    this.totalTipCash = 0;
    this.totalTipCard = 0;
    this.selectedEmployee = '';
  }

  getTotalIncome(){
    for(let i=0; i<this.orderList.length; i++){
      if(this.orderList[i]['state'] === 'complete' || this.orderList[i]['state'] === 'modified'){
        if(this.orderList[i]['paymentMode'] === 'online'){
          this.totalCard = this.totalCard + this.orderList[i]['total'];
        }else if(this.orderList[i]['paymentMode'] === 'cash'){
          this.totalCash = this.totalCash + this.orderList[i]['total'];
        }
      }
    }
  }
}
