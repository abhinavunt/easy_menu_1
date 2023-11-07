import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { AlertModalComponent } from 'src/app/modals/alert-modal/alert-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {
  public selectedIndex: number = -1;
  public categoryList: any = [];
  public totalItemList: any = [];
  public selectedItemList: any = [];
  public isAddOpen: boolean = false;
  public categoryName: string = '';
  public selectedCategoryId: string = '';
  public selectedCategoryName: string = '';
  public showAddPanel: boolean = false;
  public showItemTable: boolean = false;
  public newItemName: string;
  public newItemPrice: number;
  public editItemObject: any = {};
  public editCategoryObject: any = {};
  public loaderFlag : boolean = false;

  constructor(private service: CommonService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadCategories();
    this.loadItems();
  }

  public setRow(_index: number) {
    this.selectedIndex = _index;
  }
  addCategory(){
    this.isAddOpen = true;
  }

  cancelCategory(){
    this.isAddOpen = false;
  }

  cancelEditItem(){
    this.editItemObject = {};
  }

  cancelEditCategory(){
    this.editCategoryObject = {};
  }

  categorySelect(category: any){
    this.editItemObject = {};
    this.selectedCategoryId = category._id;
    this.selectedCategoryName = category.categoryName;
    this.selectedItemList = [];
    this.showItemTable = false;
    for(let i=0 ; i<this.totalItemList.length; i++){
      if(this.totalItemList[i]['categoryId'] === this.selectedCategoryId){
        this.selectedItemList.push(this.totalItemList[i]);
      }
    }
    this.showItemTable = true;
  }

  deleteItem(item: any){
    const modalRef = this.modalService.open(AlertModalComponent, { backdrop: 'static', centered: true });
    modalRef.result.then(
            () => {
              this.loaderFlag = true;
              let itemObj = {'itemId': item._id};
              this.service.deleteItem(itemObj).then(res => {
                this.loaderFlag = false;
                if(res['state'] === 'Success'){
                  this.editItemObject = {};
                  this.refreshItemTable();
                }
              }).catch((res: any) => {
                this.loaderFlag = false;
                console.log(res);
              });
              if (modalRef) {
                  modalRef.close();
              }
            },
            () => {
              
            }
        );
  }

  itemEdit(editObj: any, index: number){
    this.editItemObject = JSON.parse(JSON.stringify(editObj));
    this.editItemObject[index] = true;
  }

  categoryEdit(editObj: any, index: number){
    this.editCategoryObject = JSON.parse(JSON.stringify(editObj));
    this.editCategoryObject[index] = true;
  }

  categoryDelete(category: any){
    const modalRef = this.modalService.open(AlertModalComponent, { backdrop: 'static', centered: true });
    modalRef.result.then(
          () => {
            this.loaderFlag = true;
            let categoryObj = {'categoryId': category._id};
            this.service.deleteCategory(categoryObj).then(res => {
              this.loaderFlag = false;
              if(res['state'] === 'Success'){
                this.selectedIndex = -1;
                this.selectedCategoryName = '';
                this.editCategoryObject = {};
                this.loadCategories();
                this.loadItems();
              }
            }).catch((res: any) => {
              this.loaderFlag = false;
              console.log(res);
            });
            if (modalRef) {
                modalRef.close();
            }
          },
          () => {
            
          }
      );
  }

  categorySave(){
    this.loaderFlag = true;
    let categoryObject = {'categoryName':this.categoryName};
    this.service.categorySave(categoryObject).then(login => {
      this.loaderFlag = false;
      this.isAddOpen = false;
      this.categoryName = '';
      this.loadCategories();
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

  saveEditCategory(){
    this.loaderFlag = true;
    this.service.categoryUpdate(this.editCategoryObject).then(res => {
      this.loaderFlag = false;
      this.editCategoryObject = {};
      this.loadCategories();
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

  loadCategories(){
    this.loaderFlag = true;
    this.service.getCategories().then(menu => {
      this.loaderFlag = false;
      this.categoryList = menu;
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

  loadItems(){
    this.loaderFlag = true;
    this.service.getItems().then(items => {
      this.loaderFlag = false;
      this.totalItemList = items;
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

  toggleAddPanel(){
    if(this.showAddPanel){
      this.newItemName = undefined;
      this.newItemPrice = undefined;
      this.showAddPanel = false;
    }else{
      this.showAddPanel = true;
    }
    
  }

  saveNewItem(){
    this.loaderFlag = true;
    let item = {'categoryId': this.selectedCategoryId, 'itemName':this.newItemName, 'price':this.newItemPrice};
    this.service.itemSave(item).then(res => {
      this.loaderFlag = false;
      if(res['state'] === 'Success'){
        this.newItemName = undefined;
        this.newItemPrice = undefined;
        this.showAddPanel = false;
        this.refreshItemTable();
      }
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

  updateItem(){
    this.loaderFlag = true;
    this.service.updateItem(this.editItemObject).then(res => {
      this.loaderFlag = false;
      if(res['state'] === 'Success'){
        this.editItemObject = {};
        this.loadCategories();
      }
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

  refreshItemTable(){
    this.loaderFlag = true;
    this.service.getItems().then(items => {
      this.loaderFlag = false;
      this.totalItemList = items;
      this.selectedItemList = [];
      this.showItemTable = false;
      for(let i=0 ; i<this.totalItemList.length; i++){
        if(this.totalItemList[i]['categoryId'] === this.selectedCategoryId){
          this.selectedItemList.push(this.totalItemList[i]);
        }
      }
      this.showItemTable = true;
    }).catch((res: any) => {
      this.loaderFlag = false;
      console.log(res);
    });
  }

}
