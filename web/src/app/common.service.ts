import { Injectable } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  //private SERVER_API_URL = 'http://localhost:3000/api/';
  private SERVER_API_URL = '/api/';
  private itemList = [];
  private totalItemsList = [];
  private categoriesList = [];
  private loggedInUser: any = {};
  private total = 0;
  private userRole = '';
  private listSubject = new Subject();
  private loaderStatus = new Subject();

  constructor(private http: HttpClient) { }

  adminLogin(loginObject: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'adminLogin', loginObject)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  getCategories(){
    return new Promise((resolve, reject) => {
      this.http
         .get(this.SERVER_API_URL + 'getCategories')
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  getItems(){
    return new Promise((resolve, reject) => {
      this.http
         .get(this.SERVER_API_URL + 'getItems')
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  categorySave(categoryObject: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'categorySave', categoryObject)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  categoryUpdate(category: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'categoryUpdate', category)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  itemSave(item: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'itemSave', item)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  updateItem(item: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'updateItem', item)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  deleteItem(item: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'deleteItem', item)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  deleteCategory(categoryObj: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'categoryDelete', categoryObj)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  isCustomerExist(customer: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'isCustomerExist', customer)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  saveCustomer(customer: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'saveCustomer', customer)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  checkIn(order: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'checkIn', order)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  getOrders(day : any){
    return new Promise((resolve, reject) => {
      this.http
         .get(this.SERVER_API_URL + 'getOrders?offset=' + new Date().getTimezoneOffset()+'&day='+day)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  getReport(week : any, month: any){
    let year = new Date().getFullYear();
    return new Promise((resolve, reject) => {
      this.http
         .get(this.SERVER_API_URL + 'getReport?offset=' + new Date().getTimezoneOffset()+'&week='+week+'&month='+month+'&year='+year)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  completeOrder(order: any){
    return new Promise((resolve, reject) => {
      this.http
         .post(this.SERVER_API_URL + 'completeOrder', order)
         .toPromise()
         .then(
             res => {
                 // Success
                 resolve(res);
             },
             msg => {
                 // Error
                 reject(msg);
             }
         );
     });
  }

  getSummary(month: any){
    let year = new Date().getFullYear();
    let timezoneOffset = new Date().getTimezoneOffset();

    const response1 = this.http.get(this.SERVER_API_URL + 'getTotalOrderCount?offset=' + timezoneOffset+'&month='+month+'&year='+year);
    const response2 = this.http.get(this.SERVER_API_URL + 'getTotalCashValue?offset=' + timezoneOffset+'&month='+month+'&year='+year);
    const response3 = this.http.get(this.SERVER_API_URL + 'getTotalCardValue?offset=' + timezoneOffset+'&month='+month+'&year='+year);
    const response4 = this.http.get(this.SERVER_API_URL + 'getTotalTipCashValue?offset=' + timezoneOffset+'&month='+month+'&year='+year);
    const response5 = this.http.get(this.SERVER_API_URL + 'getTotalTipCardValue?offset=' + timezoneOffset+'&month='+month+'&year='+year);
    return new Promise((resolve, reject) => {
        forkJoin([response1, response2, response3, response4, response5])
            .toPromise()
            .then(
                res => {
                  resolve(res);
                },
                msg => {
                  reject(msg);
                }
            );
    });
  }

  

  getUserRole(){
    return this.userRole;
  }

  setUserRole(role: any){
    this.userRole = role;
  }

  addItem(item: any){
    item['count'] = 1;
    this.itemList.push(item);
    this.total = this.total + item.price;
    this.listSubject.next(this.itemList);
  }

  increaseItem(id: any){
    for(let i=0; i<this.itemList.length; i++){
      if(this.itemList[i]._id === id){
        this.total = this.total + this.itemList[i].price;
        this.itemList[i]['count'] = this.itemList[i]['count'] + 1;
        break;
      }
    }
    this.listSubject.next(this.itemList);
  }

  decreaseItem(id: any){
    for(let i=0; i<this.itemList.length; i++){
      if(this.itemList[i]._id === id){
        if(this.itemList[i]['count'] === 1){
          this.total = this.total - this.itemList[i].price;
          this.itemList.splice(i,1);
          break;
        }else{
          this.total = this.total - this.itemList[i].price;
          this.itemList[i]['count'] = this.itemList[i]['count'] - 1;
          break;
        }
        
        
      }
    }
    this.listSubject.next(this.itemList);
  }

  getTotalPrice(){
    return this.total;
  }

  getOrderSumary(){
    return this.itemList;
  }

  getItem(){
    return this.listSubject.asObservable();
  }

  resetItemList() {
    this.itemList = [];
    this.total = 0;
  }

  setCategoriesList(categoryList: any){
    this.categoriesList = categoryList;
  }

  setItemsList(itemList: any){
    this.totalItemsList = itemList;
  }

  getCategoriesList(){
    return this.categoriesList;
  }

  getItemsList(){
    return this.totalItemsList;
  }

  getLoggedInUser(){
    return this.loggedInUser;
  }

  setLoggedInUser(user: any){
    this.loggedInUser = user;
  }

  setLoaderStatus(value: any){
    this.loaderStatus.next(value);
  }

  getLoaderStatus(){
    return this.loaderStatus.asObservable();
  }

}
