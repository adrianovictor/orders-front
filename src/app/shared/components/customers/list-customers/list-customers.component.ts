import { Component, OnDestroy, OnInit } from '@angular/core';
import { Customer } from '../../../../core/models/customer.model';
import { CustomersService } from '../../../services/customers.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-customers',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './list-customers.component.html',
  styleUrl: './list-customers.component.css'
})
export class ListCustomersComponent implements OnInit {
  clientes: Customer[] = [];
  filteredCustomer: Customer[] = [];
  searchText: string = '';

  constructor(
    private customerService: CustomersService,
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(response => {
      this.clientes = response;
      this.filteredCustomer = response;
    })
  }

  public remover(customerId: number): void {
  }

  public filterBooks(): void {
    if (this.searchText) {
      this.filteredCustomer = this.clientes.filter(customer =>
        customer.name.toLowerCase().includes(this.searchText.toLowerCase()) || 
        customer.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredCustomer = this.clientes; // Se não houver texto de busca, exibe todos os livros
    }
  }  
}
