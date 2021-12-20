import { Payment } from './../../interfaces/Payment';
import { PaymentService } from './../../services/payment.service';
import { UserFlatten } from './../../interfaces/User';
import { CommonsService } from './../../services/commons.service';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userId: string | undefined;
  user: UserFlatten | undefined;
  userForm: FormGroup;
  isEdit: boolean = false;
  payments: Payment[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private commonService: CommonsService,
    private formBuilder: FormBuilder,
    private paymentService: PaymentService
  ) {
    this.userForm = this.formBuilder.group({
      email: [null, Validators.required],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      middle_name: [null],
      phone: [
        null,
        [
          Validators.required,
          Validators.pattern('^(\\+?d{1,4}[s-])?(?!0+s+,?$)\\d{10}s*,?$'),
        ],
      ],
    });
    this.userForm.disable();
  }

  ngOnInit() {
    this.userId = this.authService.currentUserValue?.id;
    this.getUser();

    this.paymentService
      .getPayments({ limit: 3, page: 1, user: this.userId })
      .subscribe((data) => (this.payments = data.results));
  }

  getUser() {
    this.userService.getUser(this.userId as string).subscribe((user) => {
      this.user = this.commonService.flattenObject(user) as UserFlatten;
      this.userForm.patchValue({
        ...this.user,
      });
    });
  }

  changeFormEdit() {
    this.isEdit = !this.isEdit;
    this.userForm.reset();
    this.userForm.patchValue({
      ...this.user,
    });
    if (this.isEdit) this.userForm.enable();
    else this.userForm.disable();
  }

  updateUserDetails() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    Object.keys(userData).forEach(
      (key) => (!userData[key] || userData[key] === '') && delete userData[key]
    );

    this.userService
      .updateUser({ user: userData, id: this.userId as string })
      .subscribe((user) => {
        this.getUser();
        this.userForm.disable();
        this.isEdit = false;
      });
  }

  /**
   * TrackBy method for better ngFor
   * @param index
   * @param payment
   */
  trackByPaymentId(index: number, payment: Payment): string | undefined {
    return payment.id;
  }
}
