import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Customer } from '../../../../core/models/customer.model';
import { CustomersService } from '../../../services/customers.service';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent implements OnInit {
  customerId!: number;
  customer!: Customer;
  
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private customerService: CustomersService
  ) { }

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.customerId = +id;
        this.loadCustomerData();
      }
    })
  }

  loadCustomerData() {
    this.customerService.getCustomerById(this.customerId).subscribe({
      next: (data) => {
        this.customer = data;
      },
      error: (error) => {
        console.error('Erro ao carregar os dados do cliente', error);
      }
    })
  }

  onSubmit(): void {
    this.customerService.updateCustomer(this.customer).subscribe({
      next: (response) => {
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        console.error('Erro ao atualizar o cliente', error);
      }
    });    
  }  
}
