import { Component, HostListener, Input } from '@angular/core';
import { NavItem } from '../../interfaces/nav-item.interface';
import gsap from 'gsap';

@Component({
  selector: 'shared-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  @Input({required: true})
  public navItems!: NavItem[];

  public showMobileMenu: boolean = false;

  private navHidden: boolean = false;
  private lastScrollPosition: number = 0;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScrollPosition = window.pageYOffset;
    if (currentScrollPosition < this.lastScrollPosition) {
      this.navHidden = false; // Scrolling up
    } else {
      this.navHidden = true; // Scrolling down
      this.showMobileMenu = false; // Hide mobile menu when scrolling down
    }
    this.lastScrollPosition = currentScrollPosition;

    gsap.to('#navbar', { duration: 0.5, y: this.navHidden ? -100 : 0 });
  }


  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
