import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalConfig } from '../../../interfaces/ModalConfig';
import { Property } from '../../../interfaces/Property';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss'],
})
export class CreatePropertyComponent implements OnInit {
  createProperty: FormGroup;
  @Input() public modalConfig: ModalConfig | any = {};
  @Input() public propertyFromServer: Property | undefined;
  propertyTypes: string[] = ['Flat', 'HMO', 'Cottage', 'House', 'Rooms'];
  @Output() public submitForm = new EventEmitter<Property>();
  @ViewChild('modal') private modalContent:
    | TemplateRef<CreatePropertyComponent>
    | undefined;
  private modalRef: NgbModalRef | undefined;
  @Output() public updateForm = new EventEmitter<{
    property: Property;
    id: string | undefined;
  }>();

  constructor(
    private modalService: NgbModal,

    private formBuilder: FormBuilder
  ) {
    this.createProperty = this.formBuilder.group({
      property_name: [''],
      property_type: ['', [Validators.required]],
      no_of_rooms: ['', [Validators.required]],
      address_line_1: ['', [Validators.required]],
      address_line_2: [''],
      town: ['', [Validators.required]],
      region: ['', [Validators.required]],
      country: ['', [Validators.required]],
      post_code: [''],
      notes: [''],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.propertyFromServer) {
      this.createProperty.patchValue({
        ...this.propertyFromServer,
      });
    }
  }

  /**
   * Update the form value with dropdown
   * @param e: DOM element
   */
  changeCity(e: any) {
    this.createProperty.controls['property_type'].setValue(e.target.value, {
      onlySelf: true,
    });
  }

  open(): Promise<boolean> {
    this.createProperty.reset();

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

  create() {
    if (this.createProperty.invalid) return;
    this.submitForm.emit(this.createProperty.value);
  }

  /**
   * Update property event emitter
   */
  updateProperty() {
    if (this.createProperty.invalid) return;
    this.updateForm.emit({
      property: this.createProperty.value,
      id: this.propertyFromServer?.id,
    });
  }
}
