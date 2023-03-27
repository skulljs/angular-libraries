import { Component, HostListener } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sk-scroll-to-top-btn',
  templateUrl: './sk-scroll-to-top-btn.component.html',
  styleUrls: ['./sk-scroll-to-top-btn.component.scss'],
})
export class SkScrollToTopBtnComponent {
  windowScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    console.log('scroll');

    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if ((this.windowScrolled && window.pageYOffset) || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
}
