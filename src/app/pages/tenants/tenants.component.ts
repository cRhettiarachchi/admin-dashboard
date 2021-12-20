import { Component, OnInit, ViewChild } from '@angular/core';
import { User, UserFlatten } from '../../interfaces/User';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Users } from '../../interfaces/Users';
import { ModalConfig } from '../../interfaces/ModalConfig';
import { CreateComponent } from './create/create.component';
import { CommonsService } from '../../services/commons.service';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { Payment } from '../../interfaces/Payment';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrls: ['./tenants.component.scss'],
})
export class TenantsComponent implements OnInit {
  users: UserFlatten[] = [];
  totalPages: number = 0;
  page: number = 1;
  limit: number = 10;
  userFromServer: UserFlatten | undefined;

  createModalConfig: ModalConfig = {
    modalTitle: 'Create user',
  };
  updateModalConfig: ModalConfig = { modalTitle: 'Update user' };
  paymentModalConfig: ModalConfig = { modalTitle: 'Add payment' };

  @ViewChild('modal') private createModal: CreateComponent | undefined;
  @ViewChild('updateModal') private updateModal: CreateComponent | undefined;
  @ViewChild('paymentModal') private paymentModal:
    | CreatePaymentComponent
    | undefined;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private commonService: CommonsService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  async openCreateModal() {
    return this.createModal?.open();
  }

  async openUpdateModal(user: UserFlatten) {
    // this.userService.getUser(id).subscribe((data: User) => {
    //   this.updateModal?.open();
    //   this.userFromServer = data;
    // });
    this.userFromServer = user;
    this.updateModal?.open();
  }

  /**
   * Get all users with pagination
   */
  getUsers(): void {
    this.userService
      .getUsers({ page: this.page, limit: this.limit })
      .subscribe((data: Users) => {
        this.users = data.results.map(
          (user) => this.commonService.flattenObject(user) as UserFlatten
        );

        // this.users = data.results;
        this.totalPages = data.totalPages;
      });
  }

  createUser(user: User) {
    user.role = 'user';
    this.userService.createUsers(user).subscribe((data: User) => {
      if (data && data.id) {
        // this.modalClose.nativeElement.click();
        this.createModal?.close();

        this.getUsers();

        this.toastr.success('Success', 'User created');
      }
    });
  }

  updateUser(data: { user: User; id: string | any }) {
    const { user } = data;
    user.role = 'user';
    this.userService.updateUser(data).subscribe((user) => {
      if (user && user.email) {
        // this.modalClose.nativeElement.click();
        this.updateModal?.close();

        this.getUsers();

        this.toastr.success('Success', 'User updated');
      }
    });
  }

  createPayment(payment: Payment) {
    this.paymentService.createPayment(payment).subscribe((payment) => {
      if (payment.id) {
        this.paymentModal?.close();

        this.getUsers();

        this.toastr.success('Success', 'Payment Added to User');
      }
    });
  }

  deleteUser(user_id: string) {
    this.userService.deleteUser(user_id).subscribe((data: any) => {
      if (data !== false) {
        this.toastr.success('Success', 'User deleted');
        this.getUsers();
      }
    });
  }

  /**
   * Get page value from pagination component
   * @param page
   */
  prevNextPage(page: number) {
    this.page = page;
    this.getUsers();
  }

  async addPayment(user: UserFlatten) {
    this.userFromServer = user;
    return this.paymentModal?.open();
  }
}
