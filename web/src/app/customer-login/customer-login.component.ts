import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss']
})
export class CustomerLoginComponent implements OnInit {

  public mobileNumber : string = '';
  public notFound: boolean = false;
  public customerName: string = '';
  public isWithoutMobile: boolean = false;
  public loaderFlag : boolean = false;
 
  constructor(private route:Router, private service: CommonService) { }

  ngOnInit() {
    this.service.resetItemList();
  }

  dialNumber(num: string){
    if(this.mobileNumber.length <= 9){
      this.mobileNumber = this.mobileNumber.concat(num);
      
    }
  }

  backToLogin(){
    this.notFound = false;
    this.customerName = '';
    this.mobileNumber = '';
    this.isWithoutMobile = false;
  }

  next(){
    if(this.isWithoutMobile){
      let customer = {"name":this.customerName, "phone":this.mobileNumber};
      this.service.setLoggedInUser(customer);
      this.route.navigate(['/menu'], { skipLocationChange: true});
    }else{
      this.loaderFlag = true;
      let customer = {"name":this.customerName, "phone":this.mobileNumber};
      this.service.saveCustomer(customer).then(res => {
        this.loaderFlag = false;
        if(res['state'] === 'Success'){
          this.service.setLoggedInUser(res['customer']);
          this.route.navigate(['/menu'], { skipLocationChange: true});
        }
      }).catch((res: any) => {
        this.loaderFlag = false;
        console.log(res);
      });
    }
  }

  clearNumber(){
    this.mobileNumber = this.mobileNumber.slice(0, -1);
  }

  enter(){
    this.loaderFlag = true;
    let customer = {'phoneNumber':this.mobileNumber};
    this.service.isCustomerExist(customer).then(res => {
      this.loaderFlag = false;
      if(res['state'] === 'found'){
        this.service.setLoggedInUser(res['customer']);
        this.route.navigate(['/menu'], { skipLocationChange: true});
      }else if(res['state'] === 'not_found'){
        this.notFound = true;
      }
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
    
  }

  withoutMobileCheckinin(){
    this.isWithoutMobile = true;
    this.notFound = true;
    this.mobileNumber = 'Not available';
  }

}
