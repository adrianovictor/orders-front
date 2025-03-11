import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { CustomersService } from '../../../services/customers.service';
import { Product } from '../../../../core/models/product.model';
import { Customer } from '../../../../core/models/customer.model';
import { Order } from '../../../../core/models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  products: Product[] = [];
  customers: Customer[] = [];
  order!: Order;
  orderForm!: FormGroup<any>;
  loading = true;  

  constructor(
    private productService: ProductsService,
    private customerService: CustomersService,
    private orderService: OrdersService,
    private router: Router,
    private fb: FormBuilder,
  ) { 
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.loadCustomerss();
    this.loadProducts();   
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
      },
      error: error => {
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }

  loadCustomerss(): void {
    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
      },
      error: error => {
        console.error('Erro ao carregar clientes:', error);
      }
    });
  }  

  inicializarFormulario(): void {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  get itensFormArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  adicionarItem(): void {
    const itemForm = this.fb.group({
      productId: ['', Validators.required],
      productName: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, Validators.required],
      totalPrice: [0]
    });

    // Escuta mudanças para calcular o preço total
    itemForm.get('productId')?.valueChanges.subscribe(produtoId => {
      const produto = this.products.find(p => p.id === Number.parseInt(produtoId!));
      if (produto) {
        itemForm.patchValue({
          productName: produto.name,
          unitPrice: produto.price
        });
        this.calcularTotalItem(itemForm);
      }
    });

    itemForm.get('quantity')?.valueChanges.subscribe(() => {
      this.calcularTotalItem(itemForm);
    });

    this.itensFormArray.push(itemForm);
  }

  removerItem(index: number): void {
    this.itensFormArray.removeAt(index);
    this.calcularTotalPedido();
  }

  calcularTotalItem(itemForm: FormGroup): void {
    const quantidade = itemForm.get('quantity')?.value || 0;
    const unitPrice = itemForm.get('unitPrice')?.value || 0;
    const totalPrice = quantidade * unitPrice;
    itemForm.patchValue({ totalPrice }, { emitEvent: false });
    this.calcularTotalPedido();
  }

  calcularTotalPedido(): number {
    let total = 0;
    for (let i = 0; i < this.itensFormArray.length; i++) {
      console.log(total);
      total += this.itensFormArray.at(i).get('totalPrice')?.value || 0;
    }
    return total;
  }

  onSubmit(): void {
    if (this.orderForm.valid && this.itensFormArray.length > 0) {
      const pedido = {
        ...this.orderForm.value,
        total: this.calcularTotalPedido()
      };
      
      this.orderService.saveOrder(pedido).subscribe({
        next: (result) => {
          alert('Pedido criado com sucesso!');
          this.limparFormulario();
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          console.error('Erro ao criar pedido', err);
          alert('Erro ao criar pedido. Verifique o console para mais detalhes.');
        }
      });
    } else {
      if (this.itensFormArray.length === 0) {
        alert('Adicione pelo menos um item ao pedido.');
      }
      this.marcarCamposInvalidos(this.orderForm);
    }
  }

  limparFormulario(): void {
    this.orderForm.reset({
      customerId: '',
      data: new Date().toISOString().split('T')[0],
      status: 'Novo'
    });
    
    while (this.itensFormArray.length) {
      this.itensFormArray.removeAt(0);
    }
  }

  marcarCamposInvalidos(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      if (controle instanceof FormGroup) {
        this.marcarCamposInvalidos(controle);
      } else if (controle instanceof FormArray) {
        for (let i = 0; i < controle.length; i++) {
          if (controle.at(i) instanceof FormGroup) {
            this.marcarCamposInvalidos(controle.at(i) as FormGroup);
          } else {
            controle.at(i).markAsTouched();
          }
        }
      } else {
        controle?.markAsTouched();
      }
    });
  }  
}
