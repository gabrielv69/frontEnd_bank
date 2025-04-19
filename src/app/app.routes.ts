import { ProductFormComponent } from './features/products/components/product-form/product-form.component';
import { ProductListComponent } from './features/products/components/product-list/product-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ProductListComponent },
  { path: 'product', component: ProductFormComponent },
  {
    path: 'product',
    children: [
      {
        path: 'edit/:id',
        component: ProductFormComponent,
      },
      { path: '**', redirectTo: '/product' },
    ],
  },
];
