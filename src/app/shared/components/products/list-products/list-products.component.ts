import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css'
})
export class ListProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProduct: Product[] = [];
  searchText: string = '';

  constructor(
    private produtctService: ProductsService,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.produtctService.getProducts().subscribe(response => {
      this.products = response;
      this.filteredProduct = response;
    })
  }

  public remover(customerId: number): void {
  }

  public filterProducts(): void {
    if (this.searchText) {
      this.filteredProduct = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredProduct = this.products; // Se não houver texto de busca, exibe todos os livros
    }
  }    
}
