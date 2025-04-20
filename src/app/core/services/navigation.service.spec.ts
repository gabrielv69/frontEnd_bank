import { NavigationService } from './navigation.service';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerMock: jest.Mocked<Router>;

  const testProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test.png',
    date_release: new Date(),
    date_revision: new Date(),
  };

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    service = new NavigationService(routerMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to /list', () => {
    service.goToProducts();
    expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/list']);
  });

  describe('goToAdd', () => {
    it('should navigate to /product when product is null', () => {
      service.goToAdd(null);
      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/product']);
    });

    it('should navigate to /product/edit with state when product is provided', () => {
      service.goToAdd(testProduct);
      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
      expect(routerMock.navigate).toHaveBeenCalledWith(
        ['/product/edit'],
        { state: { product: testProduct } }
      );
    });
  });


});
