import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Customer } from '../../../../core/models/customer.model';
import { CustomersService } from '../../../services/customers.service';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.css'
})
export class CreateCustomerComponent {
  customer: Customer = {
    id: 0,
    name: '',
    email: '',
    phone: ''
  };

  constructor(
    private router: Router,
    private customerService: CustomersService
  ) { }

  onSubmit(): void {
    this.customerService.saveCustomer(this.customer).subscribe(() => {
      this.router.navigate(['/clientes'])
    });
  }
}
