import { state } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
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
  public selectedDay: number = 0;
  public role: string = '';
  
  constructor(private service: CommonService) { }

  ngOnInit() {
    this.role = this.service.getUserRole();
    this.categoriesList = this.service.getCategoriesList();
    this.totalItemsList = this.service.getItemsList();
    if(this.role === 'administrator'){
      this.getDaysDropDown();
    }
    
    this.loadOrders();
  }

  getDaysDropDown(){
    for(let i=0; i<7; i++){
      if(i === 0){
        this.daysList.push({'label':'Today', 'value': i});
      }else{
        let now = new Date();
        now.setDate(now.getDate() - i);
        let dateLabel = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
        this.daysList.push({'label':dateLabel, 'value': i});
      }
    }
  }

  loadOrders(){
    this.loaderFlag = true;
    this.service.getOrders(this.selectedDay).then(orders => {
      this.loaderFlag = false;
      this.orderList = orders;
      this.reset();
      this.getTotalEmployee();
      this.getTotalIncome()
    }).catch((res: any) => {
      this.loaderFlag = false;
    });
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

  completeOrder(){
    let tipAmt = 0;
    let tipMode = '';
    if(this.orderDetails['tipAmount'] && this.orderDetails['tipAmount'] > 0){
      tipAmt = this.orderDetails['tipAmount'];
      tipMode = this.orderDetails['tipMode'];
    }
    let state='';
    if(JSON.stringify(this.orignalItemList) === JSON.stringify(this.orderDetails.items)){
      state = 'complete';
    }else{
      state = 'modified';
    }
    
     this.loaderFlag = true;
    let order = {'_id' : this.orderDetails['_id'], 
                 'total' : this.orderDetails.total,
                 'paymentMode': this.orderDetails['paymentMode'], 
                 'tipMode': tipMode,
                 'tipAmount': tipAmt,
                 'employee':this.orderDetails['employee'],
                 'state':state,
                 'items':this.orderDetails.items,
                };

    
    this.service.completeOrder(order).then(orders => {
      this.loaderFlag = false;
      this.showOrderDetails = false;
      this.loadOrders();
    }).catch((res: any) => {
      this.loaderFlag = false;
    });
  }

  onSelectEmployee(target: any){
    const tar = target as HTMLInputElement;
    const name = tar.value;
    this.totalTipCard = 0;
    this.totalTipCash = 0;
    for(let i=0; i<this.orderList.length; i++){
      if(this.orderList[i]['employee'] === name){
        if(this.orderList[i]['tipMode'] === 'online'){
          this.totalTipCard = this.totalTipCard + this.orderList[i]['tipAmount'];
        }else if(this.orderList[i]['tipMode'] === 'cash'){
          this.totalTipCash = this.totalTipCash + this.orderList[i]['tipAmount'];
        }
      }
    }
  }

  onSelectDay(target: any){
    const tar = target as HTMLInputElement;
    const day = tar.value;
    this.selectedDay = parseInt(day);
    this.loadOrders();
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

  getTotalEmployee(){
    this.employeeList = this.orderList.map(order => order.employee).filter((value, index, self) => self.indexOf(value) === index);
    this.employeeList = this.employeeList.filter(e => e !== '');
  }
}
