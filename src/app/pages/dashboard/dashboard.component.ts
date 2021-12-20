import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../interfaces/Property';
import { CreatePropertyComponent } from './create-property/create-property.component';
import { ModalConfig } from '../../interfaces/ModalConfig';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  allProperties: Property[] = [];
  totalPages: number = 0;
  page: number = 1;
  limit: number = 10;
  propertyFromServer: Property | any;

  @ViewChild('modal') private createModal: CreatePropertyComponent | undefined;
  @ViewChild('updateModal') private updateModal:
    | CreatePropertyComponent
    | undefined;
  createModalConfig: ModalConfig = {
    modalTitle: 'Create property',
  };
  constructor(
    private formBuilder: FormBuilder,
    private propertyService: PropertyService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getProperties();
  }

  /**
   * Get property method
   * Uses the page number and limit for pagination
   */
  getProperties() {
    this.propertyService
      .getProperties({ page: this.page, limit: this.limit })
      .subscribe((data: any) => {
        this.allProperties = data.results ?? [];
        this.totalPages = data.totalPages;
        this.page = data.page;
      });
  }

  /**
   * Create property method
   * Uses the form data to create new property
   */
  create(property: Property): void | boolean {
    this.propertyService.createProperty(property).subscribe((data) => {
      if (data && data.id) {
        this.createModal?.close();
        this.getProperties();
      }
    });
  }

  updateProperty(data: { property: Property; id: string | undefined }) {
    this.propertyService
      .updateProperty(data)
      .subscribe((property: Property) => {
        if (property.id) {
          this.getProperties();
          this.updateModal?.close();
          this.toastr.success('Success', 'Property updated');
        }
      });
  }

  async openCreateModal() {
    return await this.createModal?.open();
  }

  /**
   * Delete Property method
   */
  deleteProperty(propertyId: string): void {
    this.propertyService.deleteProperty(propertyId).subscribe((data) => {
      if (data !== false) {
        this.toastr.success('Success', 'Property Deleted');
        this.getProperties();
      }
    });
  }

  async openUpdateModal(id: string) {
    this.propertyService.getPropertyById(id).subscribe((data) => {
      this.propertyFromServer = data;
      this.updateModal?.open();
    });
  }

  /**
   * TrackBy method for better ngFor
   * @param index
   * @param property
   */
  trackByProperty(index: number, property: Property): string | undefined {
    return property.id;
  }

  /**
   * Get page value from pagination component
   * @param page
   */
  prevNextPage(page: number) {
    this.page = page;
    this.getProperties();
  }
}
