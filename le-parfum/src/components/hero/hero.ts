import { gsap } from 'gsap';

/**
 * Hero — Le Parfum
 *
 * Tres responsabilidades, deliberadamente separadas:
 *  1. Timeline de entrada (stagger, una sola vez al cargar)
 *  2. Spotlight que sigue al cursor (loop continuo, solo con mouse real)
 *  3. Tilt muy sutil del collage (loop continuo, solo con mouse real)
 *
 * Todo respeta prefers-reduced-motion y se desactiva por completo en táctil,
 * donde no existe un cursor que seguir.
 */
export function initHero(): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  runEntranceTimeline(hero, prefersReducedMotion);

  if (hasFinePointer && !prefersReducedMotion) {
    runSpotlight(hero);
    runCollageTilt(hero);
  }
}

/**
 * Entrada escalonada: kicker → título → lead → botones → indicadores →
 * halo → collage → tarjeta → signature. Nunca todo junto.
 */
function runEntranceTimeline(hero: HTMLElement, prefersReducedMotion: boolean): void {
  const items = {
    kicker: hero.querySelector('[data-hero-item="kicker"]'),
    title: hero.querySelector('[data-hero-item="title"]'),
    lead: hero.querySelector('[data-hero-item="lead"]'),
    actions: hero.querySelector('[data-hero-item="actions"]'),
    proof: hero.querySelector('[data-hero-item="proof"]'),
    halo: hero.querySelector('[data-hero-item="halo"]'),
    collage: hero.querySelector('[data-hero-item="collage"]'),
    edition: hero.querySelector('[data-hero-item="edition"]'),
    card: hero.querySelector('[data-hero-item="card"]'),
    signature: hero.querySelector('[data-hero-item="signature"]'),
    scroll: hero.querySelector('[data-hero-item="scroll"]'),
  };

  const allItems = Object.values(items).filter(Boolean) as HTMLElement[];

  if (prefersReducedMotion) {
    gsap.set(allItems, { opacity: 1 });
    return;
  }

  gsap.set(allItems, { opacity: 0 });
  gsap.set([items.title, items.lead, items.kicker], { y: 22 });
  gsap.set([items.actions, items.proof], { y: 16 });
  gsap.set(items.halo, { opacity: 0, scale: 0.92 });
  gsap.set(items.collage, { opacity: 0, y: 26, scale: 0.97 });
  gsap.set(items.card, { opacity: 0, y: 18 });
  gsap.set(items.signature, { opacity: 0, y: 10 });

  const ease = 'power2.out';

  const tl = gsap.timeline({ defaults: { ease, duration: 0.9 } });

  tl.to(items.kicker, { opacity: 1, y: 0 })
    .to(items.title, { opacity: 1, y: 0, duration: 1.1 }, '-=0.65')
    .to(items.lead, { opacity: 1, y: 0 }, '-=0.75')
    .to(items.actions, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6')
    .to(items.proof, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to(items.halo, { opacity: 1, scale: 1, duration: 1.2 }, '-=0.7')
    .to(items.collage, { opacity: 1, y: 0, scale: 1, duration: 1.2 }, '-=0.9')
    .to(items.edition, { opacity: 1, duration: 0.6 }, '-=0.8')
    .to(items.card, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .to(items.signature, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to(items.scroll, { opacity: 1, duration: 0.6 }, '-=0.3');

  // Flotación lenta y continua del collage — nunca se detiene, nunca se nota que empezó
  if (items.collage) {
    gsap.to(items.collage, {
      y: '+=10',
      duration: 3.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: tl.duration(),
    });
  }
}

/**
 * El spotlight sigue al cursor moviendo `transform` (translate3d), nunca
 * repintando el gradiente — así se mantiene en GPU y no cuesta layout.
 */
function runSpotlight(hero: HTMLElement): void {
  const spotlight = hero.querySelector<HTMLElement>('[data-hero-spotlight]');
  if (!spotlight) return;

  const moveX = gsap.quickTo(spotlight, 'x', { duration: 0.9, ease: 'power3.out' });
  const moveY = gsap.quickTo(spotlight, 'y', { duration: 0.9, ease: 'power3.out' });

  hero.addEventListener('pointerenter', () => hero.setAttribute('data-hero-hovering', ''));
  hero.addEventListener('pointerleave', () => hero.removeAttribute('data-hero-hovering'));

  hero.addEventListener('pointermove', (e) => {
    const rect = hero.getBoundingClientRect();
    moveX(e.clientX - rect.left);
    moveY(e.clientY - rect.top);
  });
}

/**
 * Inclinación muy leve del collage según la posición del cursor dentro del hero.
 * Rango deliberadamente pequeño (±4°) — es profundidad, no un efecto de gaming.
 */
function runCollageTilt(hero: HTMLElement): void {
  const tiltTarget = hero.querySelector<HTMLElement>('[data-hero-tilt]');
  const visual = hero.querySelector<HTMLElement>('[data-hero-visual]');
  if (!tiltTarget || !visual) return;

  const MAX_TILT_DEG = 4;

  const rotateX = gsap.quickTo(tiltTarget, 'rotateX', { duration: 0.7, ease: 'power3.out' });
  const rotateY = gsap.quickTo(tiltTarget, 'rotateY', { duration: 0.7, ease: 'power3.out' });

  visual.addEventListener('pointermove', (e) => {
    const rect = visual.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY(px * MAX_TILT_DEG * 2);
    rotateX(py * -MAX_TILT_DEG * 2);
  });

  visual.addEventListener('pointerleave', () => {
    rotateX(0);
    rotateY(0);
  });
}
