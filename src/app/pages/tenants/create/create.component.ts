import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ModalConfig } from '../../../interfaces/ModalConfig';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Property } from '../../../interfaces/Property';
import { Subject } from 'rxjs';
import { PropertyService } from '../../../services/property.service';
import { User, UserFlatten } from '../../../interfaces/User';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  @Input() public modalConfig: ModalConfig | any = {};
  @Input() public userFromServer: UserFlatten | undefined;
  @Output() public submitForm = new EventEmitter<User>();
  @Output() public updateForm = new EventEmitter<{
    user: User;
    id: string | undefined;
  }>();
  @ViewChild('modal') private modalContent:
    | TemplateRef<CreateComponent>
    | undefined;
  private modalRef: NgbModalRef | undefined;
  isSearchClicked: boolean = false;
  userRoles: string[] = ['user', 'admin'];

  createUser: FormGroup;

  @Input() public properties: Property[] = [];
  property: Property | any;
  private propertySearch = new Subject<string>();

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private propertyService: PropertyService
  ) {
    this.createUser = this.formBuilder.group({
      email: [null],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      room_number: [null],
      middle_name: [null],
      phone: [
        null,
        Validators.pattern('^(\\+?d{1,4}[s-])?(?!0+s+,?$)\\d{10}s*,?$'),
      ],
      property: [null, [Validators.required]],
      role: [null, [Validators.required]],
      notes: [null],
      rent: [
        null,
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      payment_frequency: [
        null,
        [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      ],
      password: [null, [Validators.minLength(8), Validators.required]],
    });
  }

  ngOnInit(): void {
    this.propertySearch.subscribe((data: string) =>
      setTimeout(
        () =>
          this.propertyService
            .searchProperty(data)
            .subscribe((data: Property[]) => (this.properties = data)),
        300
      )
    );
  }

  ngOnChanges(): void {
    if (this.userFromServer) {
      this.createUser.removeControl('password');
      this.property = {
        property_type: this.userFromServer.property_property_type,
        property_name: this.userFromServer.property_property_name,
      };
      this.createUser.patchValue({
        ...this.userFromServer,
        property: this.userFromServer.property_id,
      });

      if (
        this.property.property_type !== 'HMO' &&
        this.property.property_type !== 'Rooms'
      ) {
        this.createUser.removeControl('room_number');
      }
    }
  }

  open(): Promise<boolean> {
    this.createUser.reset();
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  /**
   * Update the form value with dropdown
   * @param e: DOM element
   */
  changeUser(e: any) {
    this.createUser.controls['role'].setValue(e.target.value, {
      onlySelf: true,
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

  clickSearchField() {
    this.isSearchClicked = true;
  }

  /**
   * On Outside click
   */
  outsideClick() {
    this.isSearchClicked = false;
  }

  /**
   * One search the subject gets updates
   * @param term
   */
  search(term: string) {
    this.propertySearch.next(term);
  }

  /**
   * On select element update the create user form
   * @param val
   */
  selectElement(val: Property) {
    this.createUser.controls['property'].setValue(val.id);
    this.property = val;
  }

  create() {
    if (
      this.property.property_type !== 'HMO' &&
      this.property.property_type !== 'Rooms'
    ) {
      this.createUser.removeControl('room_number');
    }
    if (this.createUser.invalid) return;
    const user = {};
    Object.keys(this.createUser.value).map((key) => {
      if (this.createUser.value[key] && this.createUser.value[key] !== '') {
        //@ts-ignore
        user[key] = this.createUser.value[key];
      }
    });
    this.submitForm.emit(user as User);
  }

  updateUser() {
    if (
      this.property.property_type !== 'HMO' &&
      this.property.property_type !== 'Rooms'
    ) {
      this.createUser.removeControl('room_number');
    }
    if (this.createUser.invalid) return;
    this.updateForm.emit({
      user: this.createUser.value,
      id: this.userFromServer?.id,
    });
  }
}
