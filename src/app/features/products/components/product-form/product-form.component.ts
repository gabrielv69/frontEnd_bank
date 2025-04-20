import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MessageService } from '../../../../core/services/message.service';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { Router } from '@angular/router';
import { constants } from '../../../../../constants/constants';
import { firstValueFrom } from 'rxjs';

/**
 * Products form component
 *
 * @author gvivas on 2025/04/18.
 * @version 1.0
 * @since 1.0.0
 */

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(),
  };
  productForm!: FormGroup;
  minDate: string = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.getProductData();
    this.buildForm();
  }

  ngOnInit(): void {
    this.listenToDateRelease();
  }

  getProductData() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { product: Product };
    if (state?.product) {
      this.isEdit = true;
      this.product = state.product;
    }
  }

  buildForm() {
    this.productForm = this.fb.group({
      id: [
        { value: '', disabled: this.isEdit },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: [
        '',
        [Validators.required, this.minDateValidator(this.minDate)],
      ],
      date_revision: [{ value: '', disabled: true }, Validators.required],
    });
  }

  minDateValidator(min: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      const minDate = new Date(min);
      return inputDate < minDate ? { minDate: true } : null;
    };
  }

  listenToDateRelease(): void {
    this.productForm
      .get('date_release')
      ?.valueChanges.subscribe((releaseDate: string) => {
        if (releaseDate) {
          const revisionDate = this.addOneYear(releaseDate);
          this.productForm.get('date_revision')?.setValue(revisionDate);
        } else {
          this.productForm.get('date_revision')?.setValue('');
        }
      });
  }

  addOneYear(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setFullYear(date.getFullYear() + 1);
    const newYear = date.getFullYear();
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newDay = String(date.getDate()).padStart(2, '0');
    return `${newYear}-${newMonth}-${newDay}`;
}

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if (this.isEdit) {
      this.updateProduct(this.product);
    } else {
      if (this.productForm.valid) {
        const isValid = await this.verificateId(this.product.id);
        if (isValid) {
          this.messageService.showMessage(
            constants.MESSAGES.PRODUCTS.ID_EXIST,
            'error'
          );
        } else {
          this.createProduct(this.product);
        }
      }
    }
  }

  getFieldErrors(fieldName: string) {
    const control = this.productForm.get(fieldName);
    const touched = control?.touched;
    const errors = control?.errors;
    return {
      show: touched && control?.invalid,
      required: !!errors?.['required'],
      minlength: !!errors?.['minlength'],
      maxlength: !!errors?.['maxlength'],
      minDate: !!errors?.['minDate'],
    };
  }

  async verificateId(id: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.productService.checkIdExists(id)
      );
      return response;
    } catch (error) {
      this.messageService.showMessage(
        constants.MESSAGES.PRODUCTS.ERROR_SERVICE,
        'error'
      );
      return true;
    }
  }

  createProduct(product: Product) {
    this.productService.create(product).subscribe(
      (response) => {
        if (response.message === constants.RESPONSES.PRODUCTS.SAVE_CORRECT) {
          this.productForm.reset();
          this.messageService.showMessage(
            constants.MESSAGES.PRODUCTS.SAVE,
            'success'
          );
        } else {
          this.messageService.showMessage(
            constants.MESSAGES.PRODUCTS.ERROR_SAVE,
            'error'
          );
        }
      },
      (error) => {
        this.messageService.showMessage(
          constants.MESSAGES.PRODUCTS.ERROR_SERVICE,
          'error'
        );
      }
    );
  }

  updateProduct(product: Product) {
    this.productService.update(product.id, product).subscribe(
      (response) => {
        if (response.message === constants.RESPONSES.PRODUCTS.UPDATE_CORRECT) {
          this.productForm.reset();
          this.messageService.showMessage(
            constants.MESSAGES.PRODUCTS.UPDATE,
            'success'
          );
        } else {
          this.messageService.showMessage(
            constants.MESSAGES.PRODUCTS.ERROR_UPDATE,
            'error'
          );
        }
      },
      (error) => {
        this.messageService.showMessage(
          constants.MESSAGES.PRODUCTS.ERROR_SERVICE,
          'error'
        );
      }
    );
  }
}
