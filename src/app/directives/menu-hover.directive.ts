import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appMenuHover]',
  standalone: true
})
export class MenuHoverDirective implements OnDestroy {
  @Input() appMenuHover!: MatMenuTrigger;
  
  private subscription: Subscription | null = null;
  private menuElement: HTMLElement | null = null;
  private closeTimer: any = null;
  private isMouseOverMenu = false;
  private isMouseOverTrigger = false;
  private isListenersAttached = false;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnDestroy(): void {
    this.clearSubscription();
    this.clearTimer();
    this.removeListeners();
  }
  
  private clearSubscription(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
  
  private clearTimer(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
  
  private removeListeners(): void {
    if (this.menuElement && this.isListenersAttached) {
      this.menuElement.removeEventListener('mouseenter', this.onMenuMouseEnter);
      this.menuElement.removeEventListener('mouseleave', this.onMenuMouseLeave);
      this.isListenersAttached = false;
      this.menuElement = null;
    }
  }
  
  private onMenuMouseEnter = (): void => {
    this.isMouseOverMenu = true;
    this.clearTimer();
  }
  
  private onMenuMouseLeave = (): void => {
    this.isMouseOverMenu = false;
    // Only close if neither menu nor trigger has mouse over it
    if (!this.isMouseOverTrigger) {
      this.scheduleClose();
    }
  }
  
  private scheduleClose(): void {
    this.clearTimer();
    // Use a slightly longer delay to make interaction smoother
    this.closeTimer = setTimeout(() => {
      if (this.appMenuHover && this.appMenuHover.menuOpen && !this.isMouseOverMenu && !this.isMouseOverTrigger) {
        this.appMenuHover.closeMenu();
      }
    }, 500);
  }

  @HostListener('click')
  onClick() {
    // For regular click behavior, let the MatMenuTrigger handle it
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isMouseOverTrigger = true;
    this.clearTimer();
    
    // Only open if not already open
    if (!this.appMenuHover.menuOpen) {
      this.appMenuHover.openMenu();
      
      this.clearSubscription();
      this.subscription = this.appMenuHover.menuOpened.subscribe(() => {
        // Find the menu panel after a small delay to ensure it's in the DOM
        setTimeout(() => {
          // Make sure we remove any existing listeners first
          this.removeListeners();
          
          // Find the menu panel that belongs to this trigger
          // We can use the panelId property of the MatMenuTrigger
          const menuId = this.appMenuHover.menu?.panelId;
          if (menuId) {
            this.menuElement = document.getElementById(menuId);
          }
          
          // Fallback to last panel if specific ID not found
          if (!this.menuElement) {
            this.menuElement = document.querySelector('.cdk-overlay-container .mat-mdc-menu-panel:last-child') as HTMLElement;
          }
          
          if (this.menuElement && !this.isListenersAttached) {
            this.menuElement.addEventListener('mouseenter', this.onMenuMouseEnter);
            this.menuElement.addEventListener('mouseleave', this.onMenuMouseLeave);
            this.isListenersAttached = true;
          }
        }, 100); // Slightly longer timeout for more reliability
      });
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isMouseOverTrigger = false;
    // Only close if neither menu nor trigger has mouse over it
    if (!this.isMouseOverMenu) {
      this.scheduleClose();
    }
  }
} 