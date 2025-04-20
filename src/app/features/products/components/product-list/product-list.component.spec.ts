import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../../../core/services/message.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { Product } from '../../../../core/models/product.model';
import { ProductListComponent } from './product-list.component';
import { ProductMenuComponent } from '../product-menu/product-menu.component';
import { ProductService } from '../../../../core/services/product.service';
import { ResponseApi } from '../../../../core/models/response.model';
import { constants } from '../../../../../constants/constants';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: jest.Mocked<ProductService>;
  let messageService: jest.Mocked<MessageService>;
  let navigationService: jest.Mocked<NavigationService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: new Date('2023-01-01'),
      date_revision: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: new Date('2023-02-01'),
      date_revision: new Date('2024-02-01'),
    },
  ];

  const mockResponse: ResponseApi = {
    data: mockProducts,
    message: 'Success',
    name: 'test',
  };

  beforeEach(async () => {
    productService = {
      getAll: jest.fn(),
    } as unknown as jest.Mocked<ProductService>;

    messageService = {
      showMessage: jest.fn(),
    } as unknown as jest.Mocked<MessageService>;

    navigationService = {
      goToAdd: jest.fn(),
    } as unknown as jest.Mocked<NavigationService>;

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ProductListComponent,
        ProductMenuComponent,
      ],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: MessageService, useValue: messageService },
        { provide: NavigationService, useValue: navigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    productService.getAll.mockReturnValue(of(mockResponse));
    component.ngOnInit();
    expect(productService.getAll).toHaveBeenCalled();
  });

  describe('loadProducts', () => {
    it('should set products when service returns data', () => {
      productService.getAll.mockReturnValue(of(mockResponse));
      component.loadProducts();
      expect(component.products).toEqual(mockProducts);
      expect(component.filteredProducts).toEqual(mockProducts);
      expect(component.visibleProducts).toEqual(
        mockProducts.slice(0, component.pageSize)
      );
    });

    it('should show info message when no products are returned', () => {
      const emptyResponse = { ...mockResponse, data: [] };
      productService.getAll.mockReturnValue(of(emptyResponse));
      component.loadProducts();
      expect(messageService.showMessage).toHaveBeenCalledWith(
        constants.MESSAGES.PRODUCTS.NO_DATA,
        'info'
      );
    });

    it('should show error message when service fails', () => {
      productService.getAll.mockReturnValue(
        throwError(() => new Error('Error'))
      );
      component.loadProducts();
      expect(messageService.showMessage).toHaveBeenCalledWith(
        constants.MESSAGES.PRODUCTS.ERROR_SERVICE,
        'error'
      );
    });
  });

  it('should return initials from product name', () => {
    expect(component.getInitials('Test Product')).toBe('TP');
    expect(component.getInitials('Another Test Product')).toBe('ATP');
    expect(component.getInitials('Single')).toBe('S');
  });

  describe('updateVisibleProducts', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.filteredProducts = mockProducts;
    });

    it('should update visible products based on page size', () => {
      component.pageSize = 1;
      component.updateVisibleProducts();
      expect(component.visibleProducts.length).toBe(1);
      expect(component.visibleProducts[0]).toEqual(mockProducts[0]);
    });
  });

  describe('applyFilter', () => {
    beforeEach(() => {
      component.products = mockProducts;
    });

    it('should filter products by search query', () => {
      component.searchQuery = 'product 1';
      component.applyFilter();
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Product 1');
    });
  });

  describe('navigation', () => {
    it('should navigate to add product', () => {
      component.redirectToAdd(null);
      expect(navigationService.goToAdd).toHaveBeenCalledWith(null);
    });

    it('should navigate to edit product', () => {
      component.onEdit(mockProducts[0]);
      expect(navigationService.goToAdd).toHaveBeenCalledWith(mockProducts[0]);
    });
  });

  describe('DOM interactions', () => {
    beforeEach(() => {
      productService.getAll.mockReturnValue(of(mockResponse));
      fixture.detectChanges();
    });

    it('should render the correct number of product rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('tbody tr');
      expect(rows.length).toBe(component.visibleProducts.length);
    });

    it('should show initials in the avatar', () => {
      const avatar = fixture.nativeElement.querySelector('.avatar');
      expect(avatar.textContent).toBe('P1');
    });


    it('should display the correct number of results', () => {
      const resultsText = fixture.nativeElement.querySelector('.footer span').textContent;
      expect(resultsText).toContain(`${component.visibleProducts.length} Resultados`);
    });

    it('should call redirectToAdd when "Agregar" button is clicked', () => {
      const addButton = fixture.nativeElement.querySelector('.btn-agregar');
      jest.spyOn(component, 'redirectToAdd');
      addButton.click();
      expect(component.redirectToAdd).toHaveBeenCalledWith(null);
    });

    it('should render product menu for each product', () => {
      const productMenus = fixture.nativeElement.querySelectorAll('app-product-menu');
      expect(productMenus.length).toBe(component.visibleProducts.length);
    });

  });

});
