import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrderTableItem} from "./order-table/order-table-datasource";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getOrders(): Observable<OrderTableItem[]>{
    return this.http.get<OrderTableItem[]>(`${this.apiServerUrl}/order/all`);
  }
  public addOrder(order:OrderTableItem): Observable<OrderTableItem>{
    return this.http.post<OrderTableItem>(`${this.apiServerUrl}/order/add`, order);
  }
  public deleteOrderById(id:number):Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/order/delete/${id}`);
  }
}
