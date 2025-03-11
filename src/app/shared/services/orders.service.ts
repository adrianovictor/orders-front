import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../core/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersApi = 'https://localhost:7084/api/orders';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<any> {
    return this.http.get<any>(this.ordersApi);
  }

  getOrderById(id: number): Observable<any>
  {
    return this.http.get<any>(this.ordersApi+`/${id}`);
  }   

  updateOrder(order: Order): Observable<any> {
    console.log(order.id);
    return this.http.put(`${this.ordersApi}/${order.id}`, order);
  }  
  
  saveOrder(order: Order): Observable<any> {
    return this.http.post(this.ordersApi, order);
  }   
}
