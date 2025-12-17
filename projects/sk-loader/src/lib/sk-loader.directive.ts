import { Directive, ElementRef, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[skLoader]',
  standalone: false,
})
export class SkLoaderDirective implements OnChanges {
  @Input() skLoader = true;
  @Input() loaderSource = 'https://raw.githubusercontent.com/skulljs/angular-libraries/main/assets/skLoader.gif';
  @Input() loaderHeight = '50px';
  @Input() loaderWidth = '50px';

  el: ElementRef;
  baseDisplay = '';
  loaderActive = false;

  uuid = uuidv4();

  constructor(el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {
    this.el = el;
  }

  toggleLoader() {
    // Ne rien faire côté serveur (SSR)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.skLoader) {
      this.el.nativeElement.style.display = 'none';
      const img = document.createElement('img');
      img.id = 'preloader_' + this.uuid;
      img.src = this.loaderSource;
      img.style.height = this.loaderHeight;
      img.style.width = this.loaderWidth;
      this.el.nativeElement.parentNode.append(img);
      this.loaderActive = true;
    } else if (this.loaderActive) {
      this.el.nativeElement.style.display = this.baseDisplay;
      const img = document.getElementById('preloader_' + this.uuid);
      if (img) {
        img.remove();
      }
    }
  }

  ngOnChanges() {
    if (!this.loaderActive) {
      this.baseDisplay = this.el.nativeElement.style.display;
    }
    this.toggleLoader();
  }
}
