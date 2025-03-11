import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Order, OrderItem } from '../../../../core/models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../../core/models/product.model';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export class OrderDetailComponent implements OnInit {
  orderId!: number;
  order!: Order;
  orderForm!: FormGroup<any>;
  loading = true;
  editMode = false;
  products: Product[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrdersService,
    private productService: ProductsService,
    private router: Router
  ) { }  

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      //this.editMode = params['mode'] === 'editar';
      this.loadProducts();
      this.initForm();
      this.loadOrder();
    });
  }
  
  initForm(): void {
    this.orderForm = this.fb.group({
      clienteId: [{value: '', disabled: !this.editMode}, Validators.required],
      clienteNome: [{value: '', disabled: !this.editMode}, Validators.required],
      data: [{value: '', disabled: !this.editMode}, Validators.required],
      orderStatus: [{value: '', disabled: !this.editMode}, Validators.required],
      total: [{value: 0, disabled: true}],
      items: this.fb.array([])
    });
  }  

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      error => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  loadOrder(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.populateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pedido:', error);
        this.loading = false;
      }
    });
  } 

  populateForm(): void {
    this.orderForm.patchValue({
      clienteId: this.order.customerId,
      clienteNome: this.order.customerName,
      data: format(this.order.orderDate, 'dd/MM/yyyy', { locale: ptBR }),
      orderStatus: this.order.orderStatus,
      total: this.order.totalAmount
    });

    console.log(this.orderForm.get("data")?.value);

    const itemsFormArray = this.orderForm.get('items') as FormArray;
    // Limpa o FormArray antes de popular
    while (itemsFormArray.length) {
      itemsFormArray.removeAt(0);
    }

    // Adiciona cada item do pedido ao FormArray
    this.order.items.forEach(item => {
      itemsFormArray.push(this.createItemFormGroup(item));
    });

    this.updateTotal();
  } 
  
  get itemsFormArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItemFormGroup(item?: OrderItem): FormGroup {
    return this.fb.group({
      orderItemId: [item ? item.id : 0],
      productId: [{value: item ? item.productId : '', disabled: !this.editMode}, Validators.required],
      productName: [{value: item ? item.productName : '', disabled: !this.editMode}, Validators.required],
      quantity: [{value: item ? item.quantity : 1, disabled: !this.editMode}, [Validators.required, Validators.min(1)]],
      unitPrice: [{value: item ? item.unitPrice : 0, disabled: !this.editMode}, [Validators.required, Validators.min(0.01)]],
      totalPrice: [{value: item ? item.totalPrice : 0, disabled: true}]
    });
  }
  
  addItem(): void {
    this.itemsFormArray.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.updateTotal();
  }

  updateItemTotal(index: number): void {
    const itemGroup = this.itemsFormArray.at(index) as FormGroup;
    const quantidade = itemGroup.get('quantity')?.value;
    const unitPrice = itemGroup.get('unitPrice')?.value;
    const totalPrice = quantidade * unitPrice;
    
    itemGroup.get('totalPrice')?.setValue(totalPrice, {emitEvent: false});
    this.updateTotal();
  }

  updateTotal(): void {
    let total = 0;
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      const itemGroup = this.itemsFormArray.at(i) as FormGroup;
      total += itemGroup.get('totalPrice')?.value;
    }
    this.orderForm.get('total')?.setValue(total);
  }
  
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    const formControls = this.orderForm.controls;
    
    if (this.editMode) {
      formControls['clienteId'].enable();
      formControls['data'].enable();
      formControls['orderStatus'].enable();
      
      for (let i = 0; i < this.itemsFormArray.length; i++) {
        const itemGroup = this.itemsFormArray.at(i) as FormGroup;
        itemGroup.get('productId')?.enable();
        itemGroup.get('productName')?.enable();
        itemGroup.get('quantity')?.enable();
        itemGroup.get('unitPrice')?.enable();
      }
    } else {
      formControls['clienteId'].disable();
      formControls['data'].disable();
      formControls['orderStatus'].disable();
      
      for (let i = 0; i < this.itemsFormArray.length; i++) {
        const itemGroup = this.itemsFormArray.at(i) as FormGroup;
        itemGroup.get('productId')?.disable();
        itemGroup.get('productName')?.disable();
        itemGroup.get('quantity')?.disable();
        itemGroup.get('unitPrice')?.disable();
      }
    }
  } 
  
  saveOrder(): void {
    // if (this.orderForm.invalid) {
    //   alert('Por favor, preencha todos os campos obrigatórios!');
    //   return;
    // }

    const orderData = {...this.orderForm.getRawValue()};
    console.log(orderData);
    
    orderData.id = this.orderId;

    this.orderService.updateOrder(orderData).subscribe(
      (response) => {
        alert('Pedido atualizado com sucesso!');
        this.toggleEditMode();
        this.loadOrder(); // Recarrega o pedido para obter os dados atualizados
      },
      (error) => {
        console.error('Erro ao atualizar pedido:', error);
        alert('Ocorreu um erro ao atualizar o pedido.');
      }
    );
  }   

  onProductChange(index: number, event: any): void {
    const productId = event.target.value;
    const selectedProduct = this.products.find(p => p.id === +productId);
    
    if (selectedProduct) {
      const itemGroup = this.itemsFormArray.at(index) as FormGroup;
      itemGroup.get('unitPrice')?.setValue(selectedProduct.price);
      this.updateItemTotal(index);
    }
  }  

  return(): void {
    this.router.navigate(['/pedidos'])
  }

  formatDate(orderDate: Date): string {
    return format(orderDate, 'dd/MM/yyyy', { locale: ptBR });
  }  
}
