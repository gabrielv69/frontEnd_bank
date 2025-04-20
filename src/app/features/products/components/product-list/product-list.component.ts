import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MessageService } from './../../../../core/services/message.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { Product } from '../../../../core/models/product.model';
import { ProductMenuComponent } from '../product-menu/product-menu.component';
import { ProductService } from '../../../../core/services/product.service';
import { constants } from '../../../../../constants/constants';

/**
 * Products list component
 *
 * @author gvivas on 2025/04/18.
 * @version 1.0
 * @since 1.0.0
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductMenuComponent],
  providers: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  visibleProducts: Product[] = [];
  totalProducts: number = 0;
  searchControl = new FormControl('');
  itemsPerPageControl = new FormControl(10);
  itemsPerPageOptions = [5, 10, 20];
  pageSize = this.itemsPerPageOptions[0];
  searchQuery: string = '';

  constructor(
    private productsService: ProductService,
    private messageService: MessageService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productsService.getAll().subscribe(
      (response) => {
        if (response.data && response.data.length > 0) {
          this.products = response.data;
          this.filteredProducts = this.products;
          this.updateVisibleProducts();
        } else {
          this.messageService.showMessage(
            constants.MESSAGES.PRODUCTS.NO_DATA,
            'info'
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  }

  updateVisibleProducts(): void {
    this.visibleProducts = this.filteredProducts.slice(0, this.pageSize);
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredProducts = this.products.filter((product) =>
      Object.values(product).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    this.updateVisibleProducts();
  }

  redirectToAdd(product: Product | null) {
    this.navigationService.goToAdd(product);
  }

  onEdit(product: Product) {
    this.redirectToAdd(product);
  }

  onDelete(product: Product) {
    //TO DO
    console.log(product);
  }
}
