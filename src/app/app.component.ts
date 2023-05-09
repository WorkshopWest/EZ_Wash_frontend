import {Component, OnInit} from '@angular/core';
import {OrderService} from "./order.service";
import {HttpErrorResponse} from "@angular/common/http";
import {SelectionModel} from "@angular/cdk/collections";
import {FormBuilder, Validators} from "@angular/forms";
import {OrderTableItem} from "./orderTableItem";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'WebApp';
  data: OrderTableItem[] = [];
  displayedColumns = ['select', 'id', 'customer', 'orderWeight', 'collectionTime', 'orderStatus'];

  registerForm = this.fb.group({
    customer: '',
    orderWeight: 0,
    collectionTime: ['', Validators.required],

  })
  selection = new SelectionModel<OrderTableItem>(true, [])
  constructor(private orderService: OrderService, private fb: FormBuilder) {
  }

  onSubmit(): void {
    // Call addorder with ordertableitem
    if(this.registerForm.invalid){
      alert("Please complete the form");
      return
    }

    let order: OrderTableItem = {
      collectionTime: this.registerForm.value.collectionTime!,
      customer: this.registerForm.value.customer!,
      id: 0,
      orderStatus: "Sent",
      orderWeight: this.registerForm.value.orderWeight!,


    };
    this.orderService.addOrder(order).subscribe(
      (response: OrderTableItem) => {
        this.selection.clear();
        this.getOrders();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    // Test
    console.log('submitted form', this.registerForm.value,
      this.registerForm.invalid)
    ;

  }
  ngOnInit() {
    this.getOrders();
  }
  public getOrders(): void {
    this.orderService.getOrders().subscribe(
      (response: OrderTableItem[]) => {
        this.data = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  onOrderToggled(order: OrderTableItem) {
    this.selection.toggle(order);
    console.log(this.selection.selected);
  }

  isAllSelected() {
    return this.selection.selected?.length == this.data?.length;
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
      console.log(this.selection.selected)
    } else {
      this.selection.select(...this.data);
      console.log(this.selection.selected)
    }
  }

  deleteOrders() {
    for(let i= 0;i < this.selection.selected.length; i++){
      let order = this.selection.selected[i];
      let date: Date = new Date();
      let datePlus: Date = new Date(new Date().getTime() + 240*60000);
      let collectionDate = new Date(order.collectionTime);

      console.log("Time now : " + date);
      console.log("Time now plus 4 hours" + datePlus);
      console.log("Collection time string: " + order.collectionTime);
      console.log("Collection time Date object : " + new Date(order.collectionTime));

      if(collectionDate >= datePlus){
        this.deleteOrdersById(order.id);
        this.selection.deselect(order);
        i --;
      }
      else{
        alert("Cancelling order with id " + order.id + " not allowed. Collection time is within 4 hours from now.")
      }

    }
    this.selection.clear();
  }
  public deleteOrdersById(id: number): void {

    this.orderService.deleteOrderById(id).subscribe(
      (response) => {
        this.getOrders();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

}
