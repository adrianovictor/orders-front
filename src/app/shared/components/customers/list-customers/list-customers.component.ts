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
  customers: Customer[] = [];
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
      this.customers = response;
      this.filteredCustomer = response;
    })
  }

  public remover(customerId: number): void {
    if (confirm('Tem certeza que deseja excluir os livros selecionados?')) {
      this.customerService.deleteCustomer(customerId).subscribe({
        next: () => {
          console.log('Operação realizada com sucesso!');
          this.loadCustomers(); // Recarrega a lista de livros após a exclusão
        },
        error: (err) => {
          console.log('Ocorreu um erro durante a operação.');
        }
      });
    }    
  }

  public filterCustomers(): void {
    if (this.searchText) {
      this.filteredCustomer = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(this.searchText.toLowerCase()) || 
        customer.email.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.filteredCustomer = this.customers; // Se não houver texto de busca, exibe todos os livros
    }
  }  
}
