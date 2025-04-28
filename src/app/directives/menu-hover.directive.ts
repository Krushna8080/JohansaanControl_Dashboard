import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Directive({
  selector: '[appMenuHover]',
  standalone: true
})
export class MenuHoverDirective implements OnInit, OnDestroy {
  @Input() appMenuHover!: MatMenuTrigger;
  
  private openByHover = false;
  private enterHandler: ((e: MouseEvent) => void) | null = null;
  private leaveHandler: ((e: MouseEvent) => void) | null = null;
  
  constructor(private elementRef: ElementRef) {}
  
  ngOnInit(): void {
    // Using direct DOM listeners avoids Angular zone issues
    this.enterHandler = (e: MouseEvent) => this.handleMouseEnter(e);
    this.leaveHandler = (e: MouseEvent) => this.handleMouseLeave(e);
    
    this.elementRef.nativeElement.addEventListener('mouseenter', this.enterHandler);
    this.elementRef.nativeElement.addEventListener('mouseleave', this.leaveHandler);
  }
  
  ngOnDestroy(): void {
    if (this.enterHandler) {
      this.elementRef.nativeElement.removeEventListener('mouseenter', this.enterHandler);
    }
    if (this.leaveHandler) {
      this.elementRef.nativeElement.removeEventListener('mouseleave', this.leaveHandler);
    }
  }
  
  private handleMouseEnter(e: MouseEvent): void {
    if (!this.appMenuHover.menuOpen) {
      this.openByHover = true;
      this.appMenuHover.openMenu();
      
      // Once the menu is open, add listeners to it
      setTimeout(() => {
        const menuPanel = document.querySelector('.mat-mdc-menu-panel') as HTMLElement;
        if (menuPanel) {
          menuPanel.addEventListener('mouseenter', () => {
            // Stay open while hovering menu
            this.openByHover = true;
          });
          
          menuPanel.addEventListener('mouseleave', () => {
            // Close when mouse leaves menu
            if (this.openByHover) {
              this.appMenuHover.closeMenu();
              this.openByHover = false;
            }
          });
        }
      }, 50);
    }
  }
  
  private handleMouseLeave(e: MouseEvent): void {
    // Get the menu element
    const menuPanel = document.querySelector('.mat-mdc-menu-panel') as HTMLElement;
    
    if (!menuPanel) {
      // If no menu, just close
      if (this.openByHover && this.appMenuHover.menuOpen) {
        this.appMenuHover.closeMenu();
        this.openByHover = false;
      }
      return;
    }
    
    // Check if we're moving toward the menu
    const menuRect = menuPanel.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Simple test - are we moving in the direction of the menu?
    const isHeadingToMenu = 
      mouseX >= menuRect.left - 20 && 
      mouseX <= menuRect.right + 20 && 
      mouseY >= menuRect.top - 20 && 
      mouseY <= menuRect.bottom + 20;
    
    if (!isHeadingToMenu && this.openByHover) {
      this.appMenuHover.closeMenu();
      this.openByHover = false;
    }
  }
  
  // Keep click support as well
  @HostListener('click')
  onClick() {
    // Reset hover tracking for click-opened menus
    this.openByHover = false;
  }
  
  // Handle click closes
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.openByHover && this.appMenuHover.menuOpen) {
      // Only handle hover-opened menus
      const clickTarget = event.target as HTMLElement;
      const triggerElement = this.elementRef.nativeElement;
      
      // Don't close for clicks on the trigger
      if (triggerElement.contains(clickTarget)) {
        return;
      }
      
      this.appMenuHover.closeMenu();
      this.openByHover = false;
    }
  }
} 