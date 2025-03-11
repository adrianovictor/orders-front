import { RouterModule, Routes } from '@angular/router';
import { ListCustomersComponent } from './shared/components/customers/list-customers/list-customers.component';
import { ListProductsComponent } from './shared/components/products/list-products/list-products.component';
import { NgModule } from '@angular/core';
import { ListOrdersComponent } from './shared/components/orders/list-orders/list-orders.component';
import { CreateCustomerComponent } from './shared/components/customers/create-customer/create-customer.component';
import { EditCustomerComponent } from './shared/components/customers/edit-customer/edit-customer.component';
import { OrderDetailComponent } from './shared/components/orders/order-detail/order-detail.component';
import { CreateOrderComponent } from './shared/components/orders/create-order/create-order.component';
import { CreateProductComponent } from './shared/components/products/create-product/create-product.component';
import { EditProductComponent } from './shared/components/products/edit-product/edit-product.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
  { path: 'clientes', component: ListCustomersComponent },
  { path: 'novo-cliente', component: CreateCustomerComponent },  
  { path: 'editar-cliente/:id', component: EditCustomerComponent },
  { path: 'produtos', component: ListProductsComponent },
  { path: 'novo-produto', component: CreateProductComponent },  
  { path: 'editar-produto/:id', component: EditProductComponent },  
  { path: 'pedidos', component: ListOrdersComponent },
  { path: 'detalhar-pedido/:id', component: OrderDetailComponent },
  { path: 'novo-pedido', component: CreateOrderComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class AppRoutingModule { }