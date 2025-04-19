import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {}

  goToProducts(): void {
    this.router.navigate(['/list']);
  }

  goToAdd(product:Product | null): void {
    if(product!==null){
      this.router.navigate(['/product/edit'], { state: { product } });
    }else{
      this.router.navigate(['/product']);
    }
  }
}
