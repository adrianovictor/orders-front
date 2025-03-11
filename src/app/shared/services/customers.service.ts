import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../core/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private customerApi = 'https://localhost:7084/api/customers';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<any> {
    return this.http.get<any>(this.customerApi)
  }

  getCustomerById(id: number): Observable<Customer>
  {
    return this.http.get<Customer>(this.customerApi+`/${id}`);
  }   

  saveCustomer(customer: Customer): Observable<any> {
    return this.http.post(this.customerApi, customer);
  } 
  
  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(`${this.customerApi}/${customer.id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.customerApi}/${id}`);
  }
}
