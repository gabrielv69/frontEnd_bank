import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Product } from '../models/product.model';
import { ProductService } from './product.service';
import { ResponseApi } from '../models/response.model';
import { TestBed } from '@angular/core/testing';
import { constants } from '../../../constants/constants';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiPath = constants.SERVICES.PRODUCT_SERVICES.APIV1.PATH;
  const verificationPath = constants.SERVICES.PRODUCT_SERVICES.APIV1.CONTROLLERS.VERIFITCATION;
  const testProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test.png',
    date_release: new Date(),
    date_revision: new Date(),
  };

  const products: Product[] = [testProduct];


  const mockResponse: ResponseApi = {
    name: 'success',
    message: 'Success',
    data: products
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to the correct endpoint', () => {
    service.getAll().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(apiPath);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should make a POST request with the product data', () => {
    service.create(testProduct).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(apiPath);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testProduct);

    req.flush(mockResponse);
  });

  it('should make a PUT request with the product data and ID', () => {
    const productId = '1';
    service.update(productId, testProduct).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${apiPath}/${productId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(testProduct);
    req.flush(mockResponse);
  });


  it('should make a DELETE request with the correct ID', () => {
    const productId = '1';
    service.delete(productId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${apiPath}${productId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  it('should make a GET request to verification endpoint', () => {
    const productId = '1';
    const mockResponse = true;
    service.checkIdExists(productId).subscribe(response => {
      expect(response).toBe(mockResponse);
    });
    const req = httpMock.expectOne(`${apiPath}${verificationPath}${productId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

});
