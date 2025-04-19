import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) {}

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  goToAdd(): void {
    this.router.navigate(['/add']);
  }
}
