import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  private prevTabIndex = 0;
  private currentTabIndex = 0;
  public categoriesList = [];
  public totalItemsList = [];
  public selectedItemsList = [];
  public addedItemList: any;
  public isNextDisabled = true;
  public showItems: boolean = false;
  public selectedCategoryName: string = '';
  public customerName: string = '';
  private subscibeItemList: Subscription;
  public colorMap = {
     0:"#bfd5ff",
     1:"#bbf1c2",
     2:"#eaeaa8",
     3:"#fdc3ce",
     4:"#9feae3",
     5:"#e2c2e5",
     6:"#ffd7b0",
     7:"#a9e6f2",
  }
  
  constructor(private service: CommonService, private route:Router) {
      this.subscibeItemList = this.service.getItem().subscribe( itemList => {
         this.addedItemList = itemList;
         if(this.addedItemList.length === 0){
            this.isNextDisabled = true;
         }else{
            this.isNextDisabled = false;
         }
      });
   }

  ngOnInit() {
    this.customerName = this.service.getLoggedInUser()['name'];
    this.categoriesList = this.service.getCategoriesList();
    this.totalItemsList = this.service.getItemsList();
    this.addedItemList = this.service.getOrderSumary();
    if(this.addedItemList.length === 0){
      this.isNextDisabled = true;
    }else{
         this.isNextDisabled = false;
    }
  }

  ngOnDestroy(){
    this.subscibeItemList.unsubscribe();
  }

  categorySelect(category: any){
   this.selectedItemsList = [];
   this.showItems = true;
   this.selectedCategoryName = category.categoryName;
   for(let i=0; i<this.totalItemsList.length; i++){
      if(this.totalItemsList[i]['categoryId'] === category['_id']){
         this.selectedItemsList.push(this.totalItemsList[i]);
      }
   }
  }

  backToMenu(){
   this.showItems = false;
  }

  addToCart(item: any){
    this.service.addItem(item);
  }

  isItemAdded(_id: any){
     if(this.addedItemList){
      for(let i=0; i<this.addedItemList.length; i++){
         if(this.addedItemList[i]._id === _id){
            return true;
         }
      }
      return false;
     }else{
        return false;
     }
   }

   getAddedItemCount(_id: any){
      for(let i=0; i<this.addedItemList.length; i++){
         if(this.addedItemList[i]._id === _id){
            return this.addedItemList[i].count;
         }
      }
   }

   increaseItem(id: any){
      this.service.increaseItem(id);
   }

   decreaseItem(id: any){
      this.service.decreaseItem(id);
   }

   next(){
      this.route.navigate(['/summary'], { skipLocationChange: true});
   }

   getColorCode(i: any){
      if(i<=7){
         return this.colorMap[i];
      }else{
         return this.colorMap[(i % 7)-1];
      }
   }

}
