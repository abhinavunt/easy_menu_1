import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent implements OnInit {

  public addedItemList: any;
  public totalPrice = 0;
  public isCompleted = false;
  public loaderFlag : boolean = false;
  public customerName : string = '';
  public waitingNo: any;
  
  constructor(private service: CommonService, private route:Router) {
   this.service.getItem().subscribe( itemList => {
      this.addedItemList = itemList;
      this.totalPrice = this.service.getTotalPrice();
      if(this.addedItemList.length === 0){
         this.route.navigate(['/menu'], { skipLocationChange: true});
      }
   });
  }

  ngOnInit() {
   this.customerName = this.service.getLoggedInUser()['name'];
    this.addedItemList = this.service.getOrderSumary();
    this.totalPrice = this.service.getTotalPrice();
  }

  getAddedItemCount(id: any){
    for(let i=0; i<this.addedItemList.length; i++){
       if(this.addedItemList[i]._id === id){
          return this.addedItemList[i].count;
       }
    }
 }

 getAddedItemPrice(id: any){
  for(let i=0; i<this.addedItemList.length; i++){
     if(this.addedItemList[i]._id === id){
        return this.addedItemList[i].count * this.addedItemList[i].price;
     }
  }
}

increaseItem(id: any){
   this.service.increaseItem(id);
}

decreaseItem(id: any){
   this.service.decreaseItem(id);
}

checkIn(){
   this.loaderFlag = true;
   let itemsList = [];
   for(let i=0; i<this.addedItemList.length; i++){
      let item = {};
      item['item'] = this.addedItemList[i]['item'];
      item['price'] = this.addedItemList[i]['price'];
      item['count'] = this.addedItemList[i]['count'];
      itemsList.push(item);
   }
   
   let order = {
      'customerName' : this.service.getLoggedInUser()['name'],
      'phoneNumber' : this.service.getLoggedInUser()['phone'],
      'paymentMode' : '',
      'tipMode' : '',
      'tipAmount' : null,
      'employee' : '',
      'total': this.service.getTotalPrice(),
      'state':'new',
      'items':itemsList,
      'offset': new Date().getTimezoneOffset()
   }

   this.service.checkIn(order).then(res => {
      this.loaderFlag = false;
      if(res['state'] === 'Success'){
         this.isCompleted = true;
         this.waitingNo = res['waitingNo'];
         setTimeout(()=>{                           
            this.route.navigate(['/'], { skipLocationChange: true});
         }, 3000);
      }
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
   
}

backToMenu(){
   this.route.navigate(['/menu'], { skipLocationChange: true});
}

}
