import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { PaymentFlatten } from '../../interfaces/Payment';
import { CommonsService } from '../../services/commons.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  totalPages: number = 0;
  page: number = 1;
  limit: number = 10;
  allPayments: PaymentFlatten[] = [];
  constructor(
    private paymentService: PaymentService,
    private commonService: CommonsService
  ) {}

  ngOnInit(): void {
    this.getPayments();
  }

  getPayments() {
    this.paymentService
      .getPayments({
        page: this.page,
        limit: this.limit,
      })
      .subscribe((payments) => {
        this.allPayments = payments.results.map(
          (result) => this.commonService.flattenObject(result) as PaymentFlatten
        );
        this.totalPages = payments.totalPages;
        this.page = payments.page;
      });
  }

  /**
   * TrackBy method for better ngFor
   * @param index
   * @param payment
   */
  trackByPaymentId(index: number, payment: PaymentFlatten): string | undefined {
    return payment.id;
  }

  /**
   * Get page value from pagination component
   * @param page
   */
  prevNextPage(page: number) {
    this.page = page;
    this.getPayments();
  }
}
