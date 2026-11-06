
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild
} from '@angular/core';

interface GameItem {
  id: number;
  label: string;
  icon: string;
  scored: boolean;
}

interface TrajectoryDot {
  x: number;
  y: number;
  opacity: number;
}

@Component({
  selector: 'app-basketball-game',
  standalone: true,
  templateUrl: './basketball-game.component.html',
  styleUrl: './basketball-game.component.scss'
})
export class BasketballGameComponent {

  @ViewChild('basket')
  basket!: ElementRef<HTMLElement>;

  items: GameItem[] = [
    { id: 1, label: 'Delete', icon: '🗑️', scored: false },
    { id: 2, label: 'Favorite', icon: '❤️', scored: false },
    { id: 3, label: 'Settings', icon: '⚙️', scored: false },
    { id: 4, label: 'Message', icon: '✉️', scored: false },
    { id: 5, label: 'Download', icon: '⬇️', scored: false }
  ];

  score = 0;
  misses = 0;

  isDragging = false;
  isFlying = false;
  isScoring = false;
  isReturning = false;

  activeItem: GameItem | null = null;

  trajectoryDots: TrajectoryDot[] = [];

  pointerX = 0;
  pointerY = 0;

  originX = 0;
  originY = 0;

  private timeoutId?: ReturnType<typeof setTimeout>;

  // Start holding an item
  startDrag(event: PointerEvent, item: GameItem): void {

    if (
      this.isDragging ||
      this.isFlying ||
      item.scored ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();

    this.activeItem = item;

    this.originX = rect.left + rect.width / 2;
    this.originY = rect.top + rect.height / 2;

    this.pointerX = this.originX;
    this.pointerY = this.originY;

    this.isDragging = true;

    this.updateTrajectory();
  }

  // Follow mouse movement
  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {

    if (!this.isDragging || this.isFlying) return;

    this.pointerX = event.clientX;
    this.pointerY = event.clientY;

    this.updateTrajectory();
  }

  // Calculate curved aiming dots
  updateTrajectory(): void {

    const dots: TrajectoryDot[] = [];

    const dx = this.pointerX - this.originX;
    const dy = this.pointerY - this.originY;

    const distance = Math.hypot(dx, dy);

    const curveHeight = Math.min(
      120,
      Math.max(35, distance * 0.25)
    );

    for (let i = 1; i <= 18; i++) {

      const t = i / 19;

      const x = this.originX + dx * t;

      const y =
        this.originY +
        dy * t -
        Math.sin(Math.PI * t) * curveHeight;

      dots.push({
        x,
        y,
        opacity: 1 - t * 0.55
      });
    }

    this.trajectoryDots = dots;
  }

  // Release mouse
  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {

    if (!this.isDragging || !this.activeItem) return;

    this.isDragging = false;
    this.trajectoryDots = [];

    const rect = this.basket.nativeElement.getBoundingClientRect();

    const isInsideBasket =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    if (isInsideBasket) {
      this.shootBasket(rect);
    } else {
      this.returnItem();
    }
  }

  // Animate item into the basket
  shootBasket(rect: DOMRect): void {

    if (!this.activeItem) return;

    this.isFlying = true;
    this.isScoring = true;

    this.pointerX = rect.left + rect.width / 2;
    this.pointerY = rect.top + rect.height / 2;

    this.timeoutId = setTimeout(() => {

      if (this.activeItem) {
        this.activeItem.scored = true;
        this.score++;
      }

      this.finishAnimation();

    }, 750);
  }

  // Return item to original position
  returnItem(): void {

    this.isReturning = true;
    this.isFlying = true;
    this.misses++;

    this.pointerX = this.originX;
    this.pointerY = this.originY;

    this.timeoutId = setTimeout(() => {
      this.finishAnimation();
    }, 450);
  }

  // Finish animation
  finishAnimation(): void {

    this.isDragging = false;
    this.isFlying = false;
    this.isScoring = false;
    this.isReturning = false;

    this.activeItem = null;
    this.trajectoryDots = [];

    this.timeoutId = undefined;
  }

  // Reset game
  resetGame(): void {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.items.forEach(item => item.scored = false);

    this.score = 0;
    this.misses = 0;

    this.finishAnimation();
  }
}
