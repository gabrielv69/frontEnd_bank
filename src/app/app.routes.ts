import { ProductAddComponent } from './features/products/components/product-add/product-add.component';
import { ProductListComponent } from './features/products/components/product-list/product-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'add', component: ProductAddComponent },

];

