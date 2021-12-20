import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalConfig } from '../../../interfaces/ModalConfig';
import { UserFlatten } from '../../../interfaces/User';
import { Payment } from '../../../interfaces/Payment';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss'],
})
export class CreatePaymentComponent implements OnInit {
  // Modal initialization data
  @Input() public modalConfig: ModalConfig | any = {};
  @Input() public user: UserFlatten | undefined;
  @Output() public submitForm = new EventEmitter<Payment>();
  // Form data
  paymentTypes: string[] = ['cash', 'bank', 'card'];
  createPayment: FormGroup;
  @ViewChild('modal') private modalContent:
    | TemplateRef<CreatePaymentComponent>
    | undefined;
  private modalRef: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.createPayment = this.formBuilder.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      payment_date: [null, [Validators.required]],
      payment_type: [null, [Validators.required]],
      is_on_time: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  open(): Promise<boolean> {
    this.createPayment.reset();
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<void> {
    if (
      this.modalConfig?.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig?.onClose === undefined ||
        (await this.modalConfig?.onClose());
      this.modalRef?.close(result);
    }
  }

  async dismiss(): Promise<void> {
    if (
      this.modalConfig?.shouldDismiss === undefined ||
      (await this.modalConfig?.shouldDismiss())
    ) {
      const result =
        this.modalConfig?.onDismiss === undefined ||
        (await this.modalConfig?.onDismiss());
      this.modalRef?.dismiss(result);
    }
  }

  addPayment() {
    if (this.createPayment.invalid) return;
    const payment = this.createPayment.value;

    payment.user = this.user?.id;
    payment.property = this.user?.property_id;
    payment.payment_date = new Date(
      payment.payment_date.year,
      payment.payment_date.month,
      payment.payment_date.day
    );

    this.submitForm.emit(payment);
  }
}
