import { Component, HostListener, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sk-scroll-to-top-btn',
  templateUrl: './sk-scroll-to-top-btn.component.html',
  styleUrls: ['./sk-scroll-to-top-btn.component.scss'],
})
export class SkScrollToTopBtnComponent implements AfterViewInit {
  @Input() normalBgColor = '#357a9b';
  @Input() hoverBgColor = '#004e6d';
  @ViewChild('btn') private btn?: ElementRef;
  windowScrolled = false;

  ngAfterViewInit() {
    if (this.btn) {
      const btn = this.btn.nativeElement as HTMLElement;
      const icon = btn.children[0] as HTMLElement;

      // normal
      btn.style.backgroundColor = this.normalBgColor;
      icon.style.fill = this.calcIconColor(this.normalBgColor);

      // hover
      btn.onmouseenter = () => {
        btn.style.backgroundColor = this.hoverBgColor;
        icon.style.fill = this.calcIconColor(this.hoverBgColor);
      };
      btn.onmouseleave = () => {
        btn.style.backgroundColor = this.normalBgColor;
        icon.style.fill = this.calcIconColor(this.normalBgColor);
      };
    }
  }

  calcIconColor(hexColor: string) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
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
