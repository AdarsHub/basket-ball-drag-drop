import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileBasket } from './file-basket';

describe('FileBasket', () => {
  let component: FileBasket;
  let fixture: ComponentFixture<FileBasket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileBasket],
    }).compileComponents();

    fixture = TestBed.createComponent(FileBasket);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
