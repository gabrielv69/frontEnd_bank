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
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-product-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.scss',
})
export class ProductAddComponent implements OnInit {
  productForm!: FormGroup;
  minDate: string = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.listenToDateRelease();
  }

  buildForm() {
    this.productForm = this.fb.group({
      id: [
        '',
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
        [Validators.required, this.minDateValidator(this.minDate)]
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
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    if (this.productForm.valid) {
      this.productService.create(this.productForm.value).subscribe();
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
      minDate: !!errors?.['minDate']
    };
  }

}
