import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasketballGameComponent } from './basketball-game.component';

describe('BasketballGameComponent', () => {
  let component: BasketballGameComponent;
  let fixture: ComponentFixture<BasketballGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasketballGameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BasketballGameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
