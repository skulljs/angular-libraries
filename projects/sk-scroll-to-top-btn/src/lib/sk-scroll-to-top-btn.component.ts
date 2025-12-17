import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, NgZone, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';

/**
 * Interface générique pour tout élément scrollable
 * Permet de supporter Material, Bootstrap ou tout autre framework
 */
interface ScrollableElement {
  getElementRef(): ElementRef<HTMLElement>;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'sk-scroll-to-top-btn',
  templateUrl: './sk-scroll-to-top-btn.component.html',
  styleUrls: ['./sk-scroll-to-top-btn.component.scss'],
  standalone: false,
})
export class SkScrollToTopBtnComponent implements AfterViewInit, OnDestroy {
  @Input() listenedElement?: HTMLElement | ScrollableElement;
  @Input() normalBgColor = '#238db7';
  @Input() hoverBgColor = '#11455a';
  @Input() minDisplayWidth?: number;
  @Input() maxDisplayWidth?: number;

  castedListenedElement?: HTMLElement;
  private scrollHandler?: () => void;
  private documentScrollHandler?: () => void;

  @ViewChild('btn') private btn?: ElementRef;
  windowScrolled = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private ngZone: NgZone) {}

  // Type guard pour vérifier si l'élément a une méthode getElementRef()
  private isScrollableElement(element: HTMLElement | ScrollableElement): element is ScrollableElement {
    return 'getElementRef' in element && typeof element.getElementRef === 'function';
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.listenedElement) {
      // Détermine si c'est un HTMLElement direct ou un objet avec getElementRef()
      this.castedListenedElement = this.isScrollableElement(this.listenedElement) ? this.listenedElement.getElementRef().nativeElement : this.listenedElement;

      if (this.castedListenedElement) {
        this.scrollHandler = () => {
          const top = this.castedListenedElement!.scrollTop;
          this.ngZone.run(() => {
            if (top > 100) {
              this.windowScrolled = true;
            } else if (this.windowScrolled && top < 10) {
              this.windowScrolled = false;
            }
          });
        };
        this.castedListenedElement.addEventListener('scroll', this.scrollHandler);
      }
    } else {
      // Écoute le scroll du document pour les pages sans listenedElement
      this.documentScrollHandler = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        this.ngZone.run(() => {
          if (scrollTop > 100) {
            this.windowScrolled = true;
          } else if (this.windowScrolled && scrollTop < 10) {
            this.windowScrolled = false;
          }
        });
      };
      document.addEventListener('scroll', this.documentScrollHandler, true);
      window.addEventListener('scroll', this.documentScrollHandler, true);
    }

    if (!this.btn) return;

    // Attendre que le DOM soit complètement rendu

    if (!this.btn) return;

    const btn = this.btn.nativeElement as HTMLElement;
    const icon = btn.querySelector('svg') as SVGElement;

    this.calcDisplayOnScreenWidth(window);

    if (icon) {
      btn.style.backgroundColor = this.normalBgColor;
      icon.style.fill = this.calcIconColor(this.normalBgColor);

      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = this.hoverBgColor;
        icon.style.fill = this.calcIconColor(this.hoverBgColor);
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = this.normalBgColor;
        icon.style.fill = this.calcIconColor(this.normalBgColor);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.castedListenedElement && this.scrollHandler) {
      this.castedListenedElement.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.documentScrollHandler && isPlatformBrowser(this.platformId)) {
      document.removeEventListener('scroll', this.documentScrollHandler, true);
      window.removeEventListener('scroll', this.documentScrollHandler, true);
    }
  }

  calcIconColor(hexColor: string) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const window = event.target as Window;
    this.calcDisplayOnScreenWidth(window);
  }

  calcDisplayOnScreenWidth(window: Window) {
    if (!this.btn) return;

    const btn = this.btn.nativeElement as HTMLElement;
    if (this.maxDisplayWidth && this.minDisplayWidth) {
      if (window.innerWidth > this.maxDisplayWidth || window.innerWidth < this.minDisplayWidth) btn.classList.add('hide');
      if (window.innerWidth <= this.maxDisplayWidth && window.innerWidth >= this.minDisplayWidth) btn.classList.remove('hide');
    } else if (this.maxDisplayWidth) {
      if (window.innerWidth > this.maxDisplayWidth) btn.classList.add('hide');
      if (window.innerWidth <= this.maxDisplayWidth) btn.classList.remove('hide');
    } else if (this.minDisplayWidth) {
      if (window.innerWidth < this.minDisplayWidth) btn.classList.add('hide');
      if (window.innerWidth >= this.minDisplayWidth) btn.classList.remove('hide');
    }
  }

  scrollToTop() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.castedListenedElement) {
      // Animation manuelle pour l'élément spécifique
      const element = this.castedListenedElement;
      const startPosition = element.scrollTop;
      const duration = 500;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOut

        element.scrollTop = startPosition * (1 - easeProgress);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          element.scrollTop = 0;
        }
      };

      requestAnimationFrame(animateScroll);
    } else {
      // Animation manuelle pour la fenêtre
      const startPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      const duration = 600; // Durée légèrement augmentée pour plus de fluidité
      const startTime = performance.now();

      // Déterminer quel élément gère le scroll
      const getScrollElement = (): HTMLElement => {
        if (document.documentElement.scrollTop > 0) {
          return document.documentElement;
        }
        if (document.body.scrollTop > 0) {
          return document.body;
        }
        return document.documentElement; // Par défaut
      };

      const scrollElement = getScrollElement();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Fonction d'easing plus douce (easeInOutCubic)
        const easeProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const targetPosition = Math.round(startPosition * (1 - easeProgress));

        // Utiliser uniquement l'élément qui gère réellement le scroll
        scrollElement.scrollTop = targetPosition;
        window.scrollTo(0, targetPosition);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          scrollElement.scrollTop = 0;
          window.scrollTo(0, 0);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }
}
