import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit, OnDestroy {
  

  // 🌟 Palabras dinámicas
  words: string[] = [
    'DEV FRONTEND',
    'INNOVADOR',
    'DEV MÓVIL',
    'CREATIVO',
    'EMPRENDEDOR'
  ];
  currentWord: string = this.words[0];
  private wordIndex: number = 0;
  private wordIntervalId: any;

  isMobile: boolean = window.innerWidth <= 768;
  // Mostrar/ocultar botones según scroll (true = visible)
  showButtonsVisible: boolean = true;
  private lastScrollTop: number = 0;
  // Filtro seleccionado: 'buy' | 'rent' | null
  selectedFilter: 'buy' | 'rent' | null = null;

  // pequeño throttle para scroll
  private ticking = false;

  ngOnInit(): void {
    this.startWordAnimation();
    // inicializar último scroll (usar siempre para coherencia)
    this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

    // 🌟 Detectar viewport (animaciones móviles)
    if (this.isMobile) {
      const target = document.querySelector('.myprofile');
      if (target) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                target.classList.add('visible');
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(target);
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        // Mostrar/ocultar: solo ocultar si el scroll baja lo suficiente
        const hideOffset = 160; // px desde top para empezar a ocultar
        const delta = 10; // sensibilidad vertical
        if (st > this.lastScrollTop + delta && st > hideOffset) {
          this.showButtonsVisible = false;
        } else if (st < this.lastScrollTop - delta) {
          this.showButtonsVisible = true;
        }
        this.lastScrollTop = st <= 0 ? 0 : st;
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  toggleFilter(which: 'buy' | 'rent') {
    if (this.selectedFilter === which) {
      this.selectedFilter = null;
    } else {
      this.selectedFilter = which;
    }
  }

  /**
   * 🔥 Animación fluida de palabras (fade-out → cambio → fade-in)
   */
  startWordAnimation() {
    this.wordIntervalId = setInterval(() => {
      const highlightEl = document.querySelector('.highlight');
      if (highlightEl) {
        // Fade out
        highlightEl.classList.add('fade-out');

        setTimeout(() => {
          // Cambiar palabra
          this.wordIndex = (this.wordIndex + 1) % this.words.length;
          this.currentWord = this.words[this.wordIndex];

          // Fade in
          highlightEl.classList.remove('fade-out');
          highlightEl.classList.add('fade-in');

          // Quitar clase después de animación
          setTimeout(() => highlightEl.classList.remove('fade-in'), 800);
        }, 600); // tiempo para que termine el fade-out
      }
    }, 3500); // cada 3.5 segundos cambia
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnDestroy(): void {
    if (this.wordIntervalId) {
      clearInterval(this.wordIntervalId);
    }
  }
}
