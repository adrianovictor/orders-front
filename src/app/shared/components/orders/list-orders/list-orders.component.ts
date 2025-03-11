import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../core/models/order.model';
import { OrdersService } from '../../../services/orders.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormatNumber } from '../../../utils/format-number';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-list-orders',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.css'
})
export class ListOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrder: Order[] = [];
  searchText: string = '';

  constructor(
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    this.loadOrders();  
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(response => {
      this.orders = response;
      this.filteredOrder = response;
    });
  }

  public filteredOrders(): void {
    if (this.searchText) {
      this.filteredOrder = this.orders.filter(order => 
        order.customerName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredOrder = this.orders;
    }
  }

  public remover(orderId: number): void {
  }

  formatValue(value: number): string {
    return `R$ ${FormatNumber.formatBrazilianNumber(value, 2)}`;
  }

  formatDate(orderDate: Date): string {
    return format(orderDate, 'dd/MM/yyyy', { locale: ptBR });
  }

  public getOrderStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Pendente';
      case 2:
        return 'Em Processamento';
      case 6:
        return 'Enviado';
      case 7:
        return 'Entregue';
      case 8:
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }
}
