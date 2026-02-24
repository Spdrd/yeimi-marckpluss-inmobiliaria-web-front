import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild, Renderer2, HostListener } from '@angular/core';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css']
})
export class AboutmeComponent implements OnInit, AfterViewInit, OnDestroy {
  isVisible = false;
  observer!: IntersectionObserver;
  @ViewChild('achievementsViewport', { static: false }) achievementsViewport!: ElementRef;
  @ViewChild('achievementsTrack', { static: false }) achievementsTrack!: ElementRef;
  @ViewChild('aboutContainer', { static: false }) aboutContainer!: ElementRef;
  @ViewChild('aboutLeft', { static: false }) aboutLeft!: ElementRef;
  @ViewChild('aboutRight', { static: false }) aboutRight!: ElementRef;
  private resizeTimeout: any;

  logros = [
    {
      icon: 'fas fa-handshake',
      title: 'Acompañamiento Personalizado',
      description: 'Asesoría cercana y profesional durante todo el proceso de venta o arriendo.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Transparencia',
      description: 'Procesos claros, información detallada y comunicación constante en cada etapa.'
    },
    {
      icon: 'fas fa-home',
      title: 'Experiencia en el Mercado',
      description: 'Conocimiento profundo del mercado inmobiliario, especialmente en Bogotá.'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Estrategia Comercial',
      description: 'Planes de comercialización efectivos para maximizar la visibilidad y el valor de cada propiedad.'
    },
    {
      icon: 'fas fa-camera',
      title: 'Marketing Inmobiliario',
      description: 'Promoción digital y posicionamiento estratégico de inmuebles.'
    },
    {
      icon: 'fas fa-users',
      title: 'Red de Contactos',
      description: 'Amplia base de compradores, arrendatarios e inversionistas potenciales.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Agilidad en Procesos',
      description: 'Gestión eficiente para reducir tiempos de cierre sin comprometer la calidad.'
    },
    {
      icon: 'fas fa-comments',
      title: 'Comunicación Efectiva',
      description: 'Atención oportuna y seguimiento constante a propietarios y clientes.'
    },
    {
      icon: 'fas fa-building',
      title: 'Cobertura Nacional',
      description: 'Intermediación de ventas y arriendos a nivel nacional con enfoque en Bogotá.'
    },
    {
      icon: 'fas fa-search-dollar',
      title: 'Valoración Profesional',
      description: 'Análisis de mercado para establecer precios competitivos y atractivos.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Confianza y Cercanía',
      description: 'Construimos relaciones basadas en el respeto, la ética y el compromiso.'
    }
  ];

  // Duplicamos logros para crear efecto infinito en el carrusel
  get logrosDuplicados() {
    return [...this.logros, ...this.logros];
  }

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    // Activamos animación solo cuando la sección está visible
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;   // activa animación
        } else {
          this.isVisible = false;  // pausa animación
        }
      });
    }, { threshold: 0.2 });

    this.observer.observe(this.el.nativeElement);
  }

  ngAfterViewInit() {
    // initial adjustment for desktop to avoid cutting cards
    setTimeout(() => this.adjustViewportHeight(), 50);
  }

  @HostListener('window:resize')
  onWindowResize() {
    // debounce resize
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.adjustViewportHeight(), 120);
  }

  private adjustViewportHeight() {
    try {
      const viewportEl = this.achievementsViewport?.nativeElement as HTMLElement | undefined;
      const trackEl = this.achievementsTrack?.nativeElement as HTMLElement | undefined;
      const aboutLeftEl = this.aboutLeft?.nativeElement as HTMLElement | undefined;
      const aboutRightEl = this.aboutRight?.nativeElement as HTMLElement | undefined;
      if (!viewportEl || !trackEl) return;

      // On desktop (where we use vertical scrolling) ensure viewport height matches tallest card
      const desktop = window.innerWidth >= 1024;
      if (!desktop) {
        // remove any explicit height on smaller screens
        this.renderer.removeStyle(viewportEl, 'height');
        if (aboutRightEl) this.renderer.removeStyle(aboutRightEl, 'height');
        return;
      }

      const cards = trackEl.querySelectorAll('.achievement-card');
      let maxH = 0;
      cards.forEach((c: Element) => {
        const el = c as HTMLElement;
        const h = el.offsetHeight;
        if (h > maxH) maxH = h;
      });

      // If we can measure left column, make right column height match it so the carousel
      // fills the component vertically and cards are fully visible.
      if (aboutLeftEl && aboutRightEl) {
        const leftH = aboutLeftEl.offsetHeight;
        if (leftH > 0) {
          this.renderer.setStyle(aboutRightEl, 'height', `${leftH}px`);
          // set viewport to match available height (subtract small gaps if needed)
          const finalH = leftH; // keep equal; CSS gap handled by internal layout
          this.renderer.setStyle(viewportEl, 'height', `${finalH}px`);
          return;
        }
      }

      if (maxH > 0) {
        // fallback: use tallest card height
        const finalH = maxH + 20;
        this.renderer.setStyle(viewportEl, 'height', `${finalH}px`);
      }
    } catch (err) {
      // fail silently
      console.warn('adjustViewportHeight error', err);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
