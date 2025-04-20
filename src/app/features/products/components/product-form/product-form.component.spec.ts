import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CommonModule } from '@angular/common';
import { MessageService } from '../../../../core/services/message.service';
import { Product } from '../../../../core/models/product.model';
import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../../core/services/product.service';
import { ResponseApi } from '../../../../core/models/response.model';
import { Router } from '@angular/router';
import { constants } from '../../../../../constants/constants';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockMessageService: jest.Mocked<MessageService>;
  let mockRouter: jest.Mocked<Router>;
  let formBuilder: FormBuilder;

  const mockProduct: Product = {
    id: 'test123',
    name: 'Test Product',
    description: 'This is a test product',
    logo: 'logo.png',
    date_release: new Date('2035-01-01'),
    date_revision: new Date('2036-01-01'),
  };

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: new Date('2033-01-01'),
      date_revision: new Date('2034-01-01'),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: new Date('2033-02-01'),
      date_revision: new Date('2034-02-01'),
    },
  ];

  const mockResponse: ResponseApi = {
    data: mockProducts,
    message: 'Success',
    name: 'test',
  };

  beforeEach(async () => {
    mockProductService = {
      checkIdExists: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    mockMessageService = {
      showMessage: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    mockRouter = {
      getCurrentNavigation: jest.fn(),
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProductFormComponent,
      ],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: mockProductService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize form with empty values when not in edit mode', () => {
      expect(component.productForm).toBeDefined();
      expect(component.productForm.get('id')?.value).toBe('');
      expect(component.productForm.get('name')?.value).toBe('');
      expect(component.productForm.get('description')?.value).toBe('');
      expect(component.productForm.get('logo')?.value).toBe('');
      expect(component.isEdit).toBe(false);
    });

    it('should initialize form with product data when in edit mode', () => {
      // Simulamos que estamos en modo edición
      mockRouter.getCurrentNavigation.mockReturnValue({
        extras: {
          state: { product: mockProduct },
        },
      } as any);

      // Recreamos el componente para que tome los nuevos valores
      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.isEdit).toBe(true);
      expect(component.productForm.get('id')?.value).toBe(mockProduct.id);
      expect(component.productForm.get('name')?.value).toBe(mockProduct.name);
      expect(component.productForm.get('description')?.value).toBe(
        mockProduct.description
      );
      expect(component.productForm.get('logo')?.value).toBe(mockProduct.logo);
    });

    it('should disable id field when in edit mode', () => {
      mockRouter.getCurrentNavigation.mockReturnValue({
        extras: {
          state: { product: mockProduct },
        },
      } as any);

      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.productForm.get('id')?.disabled).toBe(true);
    });
  });

  describe('Form Validations', () => {
    it('should validate required fields', () => {
      const form = component.productForm;
      form.setValue({
        id: '',
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: '',
      });

      expect(form.valid).toBe(false);
      expect(form.get('id')?.errors?.['required']).toBeTruthy();
      expect(form.get('name')?.errors?.['required']).toBeTruthy();
      expect(form.get('description')?.errors?.['required']).toBeTruthy();
      expect(form.get('logo')?.errors?.['required']).toBeTruthy();
      expect(form.get('date_release')?.errors?.['required']).toBeTruthy();
    });

    it('should validate min and max length for id', () => {
      const idControl = component.productForm.get('id');

      idControl?.setValue('ab');
      expect(idControl?.errors?.['minlength']).toBeTruthy();

      idControl?.setValue('abcdefghijk');
      expect(idControl?.errors?.['maxlength']).toBeTruthy();

      idControl?.setValue('abc');
      expect(idControl?.errors).toBeNull();
    });

    it('should validate min and max length for name', () => {
      const nameControl = component.productForm.get('name');

      nameControl?.setValue('abcd');
      expect(nameControl?.errors?.['minlength']).toBeTruthy();

      nameControl?.setValue('a'.repeat(101));
      expect(nameControl?.errors?.['maxlength']).toBeTruthy();

      nameControl?.setValue('Valid Name');
      expect(nameControl?.errors).toBeNull();
    });

    it('should validate min and max length for description', () => {
      const descControl = component.productForm.get('description');

      descControl?.setValue('short');
      expect(descControl?.errors?.['minlength']).toBeTruthy();

      descControl?.setValue('a'.repeat(201));
      expect(descControl?.errors?.['maxlength']).toBeTruthy();

      descControl?.setValue('Valid description with enough length');
      expect(descControl?.errors).toBeNull();
    });

    it('should validate date_release is not before minDate', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const dateControl = component.productForm.get('date_release');
      dateControl?.setValue(yesterday.toISOString().split('T')[0]);

      expect(dateControl?.errors?.['minDate']).toBeTruthy();

      dateControl?.setValue(today.toISOString().split('T')[0]);
      expect(dateControl?.errors).toBeNull();
    });
  });

  describe('Date Release Listener', () => {
    it('should update date_revision when date_release changes', () => {
      const releaseDate = '2025-01-01';
      const expectedRevisionDate = '2026-01-01';

      component.productForm.get('date_release')?.setValue(releaseDate);

      expect(component.productForm.get('date_revision')?.value).toBe(
        expectedRevisionDate
      );
    });

    it('should clear date_revision when date_release is empty', () => {
      component.productForm.get('date_release')?.setValue('2025-01-01');
      expect(component.productForm.get('date_revision')?.value).not.toBe('');

      component.productForm.get('date_release')?.setValue('');
      expect(component.productForm.get('date_revision')?.value).toBe('');
    });

    it('should disable date_revision field', () => {
      expect(component.productForm.get('date_revision')?.disabled).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.productForm.setValue({
        id: 'test123',
        name: 'Test Product',
        description: 'This is a test product',
        logo: 'logo.png',
        date_release: '2028-01-01',
        date_revision: '2029-01-01',
      });
    });

    it('should not submit if form is invalid', () => {
      component.productForm.setErrors({ invalid: true });
      component.onSubmit();

      expect(mockProductService.create).not.toHaveBeenCalled();
      expect(mockProductService.update).not.toHaveBeenCalled();
    });

    it('should mark all as touched if form is invalid', () => {
      component.productForm.setErrors({ invalid: true });
      const markAllAsTouchedSpy = jest.spyOn(
        component.productForm,
        'markAllAsTouched'
      );

      component.onSubmit();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should call update if form is valid and is edit', () => {
      mockResponse.message= constants.RESPONSES.PRODUCTS.UPDATE_CORRECT;
      mockProductService.update.mockReturnValue(of(mockResponse));
      component.isEdit=true
      component.onSubmit();
      expect(mockProductService.update).toHaveBeenCalled();
    });

    it('should call create if form is valid and is NOT edit', async () => {
      mockProductService.checkIdExists.mockReturnValue(of(false));
      mockResponse.message = constants.RESPONSES.PRODUCTS.SAVE_CORRECT;
      mockProductService.create.mockReturnValue(of(mockResponse));
      component.isEdit = false;
      await component.onSubmit();
      expect(mockProductService.create).toHaveBeenCalled();
    });

  });

  describe('getFieldErrors', () => {
    it('should return correct error states for a field', () => {
      const fieldName = 'name';
      const control = component.productForm.get(fieldName);

      // Caso: untouched
      control?.markAsUntouched();
      let errors = component.getFieldErrors(fieldName);
      expect(errors.show).toBe(false);

      // Caso: touched y required
      control?.markAsTouched();
      control?.setValue('');
      errors = component.getFieldErrors(fieldName);
      expect(errors.show).toBe(true);
      expect(errors.required).toBe(true);

      // Caso: minlength
      control?.setValue('abcd');
      errors = component.getFieldErrors(fieldName);
      expect(errors.minlength).toBe(true);

      // Caso: maxlength
      control?.setValue('a'.repeat(101));
      errors = component.getFieldErrors(fieldName);
      expect(errors.maxlength).toBe(true);

      // Caso: válido
      control?.setValue('Valid Name');
      errors = component.getFieldErrors(fieldName);
      expect(errors.show).toBe(false);
    });
  });

  describe('addOneYear', () => {
    it('should correctly add one year to a date string', () => {
      expect(component.addOneYear('2023-02-28')).toBe('2024-02-28');
    });
  });

  describe('createProduct', () => {
    beforeEach(() => {
      component.productForm.setValue({
        id: 'test123',
        name: 'Test Product',
        description: 'This is a test product',
        logo: 'logo.png',
        date_release: '2028-01-01',
        date_revision: '2029-01-01',
      });
    });

    it('should reset the form and show success message when creation is successful', () => {
      mockResponse.message= constants.MESSAGES.PRODUCTS.SAVE;
      mockProductService.create.mockReturnValue(of(mockResponse));
      component.createProduct(component.productForm.value);
      expect(mockMessageService.showMessage).toHaveBeenCalled();
    });

    it('should show error message when service returns error response', () => {
      mockProductService.create.mockReturnValue(of(mockResponse));
      component.createProduct(component.productForm.value);
      expect(mockMessageService.showMessage).toHaveBeenCalledWith(
        constants.MESSAGES.PRODUCTS.ERROR_SAVE,
        'error'
      );
    });
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      component.productForm.setValue({
        id: 'test123',
        name: 'Test Product',
        description: 'This is a test product',
        logo: 'logo.png',
        date_release: '2028-01-01',
        date_revision: '2029-01-01',
      });
    });

    it('should reset the form and show success message when update is successful', () => {
      mockResponse.message= constants.RESPONSES.PRODUCTS.UPDATE_CORRECT;
      mockProductService.update.mockReturnValue(of(mockResponse));
      component.updateProduct(component.productForm.value);
      expect(mockMessageService.showMessage).toHaveBeenCalled();
    });

    it('should show error message when service returns error response', () => {
      mockProductService.update.mockReturnValue(of(mockResponse));
      component.updateProduct(component.productForm.value);
      expect(mockMessageService.showMessage).toHaveBeenCalled();
    });
  });


});
