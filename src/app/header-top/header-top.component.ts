import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.css']
})
export class HeaderTopComponent implements OnInit {

 navItems = [
    { name: 'Inicio', url: '#', icon: 'fas fa-home' }, // Se mantiene, es el estándar.
    { name: 'Catalogo', url: '#catalogo', icon: 'fas fa-book-open' }, // "book-open" o "th-list" representan mejor un catálogo que un birrete.
    { name: 'Valores', url: '#tecnologias', icon: 'fas fa-chart-bar' }, // "chart-bar" o "database" para representar información o métricas.
    { name: 'Sobre Nosotros', url: '#sobre-nosotros', icon: 'fas fa-users' }, // "users" representa un equipo o grupo de personas.
    { name: 'Contactos', url: '#contacto', icon: 'fas fa-paper-plane' } // "paper-plane" o "phone" son variaciones modernas al sobre clásico.
];

  activeTab = 'Inicio';
  isMobile = false;

  // Filtrar navItems para mobile (omitir 'Inicio' ya que el logo será el botón home)
  get mobileNavItems() {
    return this.navItems.filter(item => item.name !== 'Inicio');
  }

  // Método para navegar a home desde el logo
  goToHome(event: Event) {
    event.preventDefault();
    this.activeTab = 'Inicio';
    this.smoothScrollTo(0);
  }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    this.onWindowScroll(); // Check initial position
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  // Alto real del header fijo (para no aterrizar tapado por la barra)
  private getHeaderOffset(): number {
    const navbar = document.querySelector('.tubelight-navbar') as HTMLElement | null;
    const navbarHeight = navbar ? navbar.offsetHeight : 100;
    return navbarHeight + 16; // pequeño margen de respiro
  }

  private scrollAnimationId: number | null = null;

  /**
   * Scroll suave propio con requestAnimationFrame.
   * Escribe scrollTop directamente para ser fiable sin importar
   * si el elemento que hace scroll es <html> o <body>, ni el CSS scroll-behavior.
   */
  private smoothScrollTo(targetY: number, duration = 750): void {
    const scroller = (document.scrollingElement || document.documentElement) as HTMLElement;
    const startY = scroller.scrollTop;
    const maxY = scroller.scrollHeight - window.innerHeight;
    const destY = Math.max(0, Math.min(targetY, maxY));
    const distance = destY - startY;

    if (Math.abs(distance) < 2) {
      scroller.scrollTop = destY;
      return;
    }

    // Cancela cualquier animación de scroll en curso
    if (this.scrollAnimationId !== null) {
      cancelAnimationFrame(this.scrollAnimationId);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      scroller.scrollTop = destY;
      return;
    }

    const startTime = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      scroller.scrollTop = startY + distance * easeInOutCubic(progress);

      if (progress < 1) {
        this.scrollAnimationId = requestAnimationFrame(step);
      } else {
        this.scrollAnimationId = null;
      }
    };

    this.scrollAnimationId = requestAnimationFrame(step);
  }

  setActiveTab(name: string, event: Event) {
    event.preventDefault();
    this.activeTab = name;
    const item = this.navItems.find(i => i.name === name);
    if (item) {
      const id = item.url.replace('#', '');
      if (id === '') {
        this.smoothScrollTo(0);
      } else {
        const element = document.getElementById(id);
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - this.getHeaderOffset();
          this.smoothScrollTo(offsetPosition);
        }
      }
    }
  }

  lastScrollTop = 0;
  isHidden = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    // Determine scroll direction
    if (st > this.lastScrollTop && st > 100) {
      // Scrolling Down
      this.isHidden = true;
    } else {
      // Scrolling Up
      this.isHidden = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

    const sections = this.navItems.map(item => {
      const id = item.url.replace('#', '');
      // Handle 'Home' which might be top of page or specific section
      if (id === '') return document.body;
      return document.getElementById(id);
    });

    const scrollPosition = window.scrollY + this.getHeaderOffset() + 20; // Offset real del header

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (section) {
        const offsetTop = section.offsetTop || 0; // Body might not have offsetTop in some contexts, usually 0
        if (scrollPosition >= offsetTop) {
          this.activeTab = this.navItems[i].name;
          break;
        }
      }
    }
  }
}
