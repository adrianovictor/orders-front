import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  productId!: number;
  product!: Product;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private prouductService: ProductsService    
  ) {
  }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.productId = +id;
        this.loadProductData();
      }
    })
  } 
  
  loadProductData() {
    this.prouductService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (error) => {
        console.error('Erro ao carregar os dados do produto', error);
      }
    })
  }
  
  onSubmit(): void {
    this.prouductService.updateProduct(this.product).subscribe({
      next: (response) => {
        alert('Pedido atualizado com sucesso!');
        this.router.navigate(['/produtos']);
      },
      error: (error) => {
        console.error('Erro ao atualizar o product', error);
      }
    });    
  }    
}
