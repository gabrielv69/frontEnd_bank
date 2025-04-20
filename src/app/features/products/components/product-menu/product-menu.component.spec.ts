import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { ProductMenuComponent } from './product-menu.component';

describe('ProductMenuComponent', () => {
  let component: ProductMenuComponent;
  let fixture: ComponentFixture<ProductMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ProductMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Menu toggle functionality', () => {
    it('should toggle isOpen when toggleMenu is called', () => {
      expect(component.isOpen).toBe(false);

      const event = new Event('click');
      jest.spyOn(event, 'stopPropagation');

      component.toggleMenu(event);
      expect(component.isOpen).toBe(true);
      expect(event.stopPropagation).toHaveBeenCalled();

      component.toggleMenu(event);
      expect(component.isOpen).toBe(false);
    });
  });

  it('should stop propagation on menu click', () => {
    const event = new MouseEvent('click');
    jest.spyOn(event, 'stopPropagation');

    component.onMenuClick(event);
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  describe('Menu actions', () => {
    it('should emit edit event and close menu', () => {
      jest.spyOn(component.edit, 'emit');
      component.isOpen = true;

      component.onEdit();

      expect(component.edit.emit).toHaveBeenCalled();
      expect(component.isOpen).toBe(false);
    });

    it('should emit delete event and close menu', () => {
      jest.spyOn(component.delete, 'emit');
      component.isOpen = true;

      component.onDelete();

      expect(component.delete.emit).toHaveBeenCalled();
      expect(component.isOpen).toBe(false);
    });

    it('should close menu when close is called', () => {
      component.isOpen = true;
      component.close();
      expect(component.isOpen).toBe(false);
    });
  });

  describe('DOM interactions', () => {
    it('should toggle menu when menu button is clicked', () => {
      const menuButton = fixture.nativeElement.querySelector('.menu-button');
      jest.spyOn(component, 'toggleMenu');
      menuButton.click();
      expect(component.toggleMenu).toHaveBeenCalled();
    });

    it('should show menu options when isOpen is true', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const menuOptions = fixture.nativeElement.querySelector('.menu-options');
      expect(menuOptions).toBeTruthy();
      expect(menuOptions.children.length).toBe(2);
    });

    it('should hide menu options when isOpen is false', () => {
      component.isOpen = false;
      fixture.detectChanges();

      const menuOptions = fixture.nativeElement.querySelector('.menu-options');
      expect(menuOptions).toBeFalsy();
    });
  });
});
