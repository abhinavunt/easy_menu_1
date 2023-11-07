import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'e-menu';
  public loaderStatus: Subscription;
  public loaderState: any = false;

constructor(private service: CommonService, private route:Router) {
  
}

ngOnInit() {
  this.loadCategories();
  this.loadItems();
}

ngOnDestroy() {
  this.loaderStatus.unsubscribe();
}

loadCategories(){
  this.service.getCategories().then(menu => {
    this.service.setCategoriesList(menu);
  }).catch((res: any) => {
      console.log(res);
  });
}

loadItems(){
  this.service.getItems().then(items => {
    this.service.setItemsList(items);
  }).catch((res: any) => {
      console.log(res);
  });
}

adminLogin(){
  this.route.navigate(['/adminLogin'], { skipLocationChange: true});
}

}
