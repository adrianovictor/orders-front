import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productApi = 'https://localhost:7084/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.productApi)
  }

  getProductById(id: number): Observable<any>
  {
    return this.http.get<any>(this.productApi+`/${id}`);
  }   

  saveProduct(product: Product): Observable<any> {
    return this.http.post(this.productApi, product);
  } 
  
  updateProduct(product: Product): Observable<any> {
    return this.http.put(`${this.productApi}/${product.id}`, product);
  } 

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.productApi}/${id}`);
  }   
}
