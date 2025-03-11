import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../../services/products.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.css'
})
export class CreateProductComponent {
  product: Product = {
    id: 0,
    name: '',
    price: 0
  };

  constructor(
    private router: Router,
    private productService: ProductsService
  ) { }

  onSubmit(): void {
    this.productService.saveProduct(this.product).subscribe(() => {
      this.router.navigate(['/produtos'])
    });
  }
}
