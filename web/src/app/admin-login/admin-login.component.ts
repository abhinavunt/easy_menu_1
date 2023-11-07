import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  public userName: any = "";
  public password: any = "";
  public savedUser = "admin";
  public savedPassword = "admin";
  public loaderFlag : boolean = false;

  public isAuth = true;
  
  constructor(private route:Router, private service: CommonService) { }

  ngOnInit() {
  }

  signIn(){
    this.loaderFlag = true;
    let loginObject = {'userName':this.userName, 'password':this.password};
    this.service.adminLogin(loginObject).then(login => {
      this.loaderFlag = false;
      if(login['status'] === 'not_found'){
        this.isAuth = false;
      }else if(login['status'] === 'found'){
        this.service.setUserRole(login['user'].role);
        this.isAuth = true;
        this.route.navigate(['/adminPortal'], { skipLocationChange: true});
      }
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

}
