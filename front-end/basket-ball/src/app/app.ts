import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasketballGameComponent } from './basketball-upload/basketball-game.component';

@Component({
  imports: [ BasketballGameComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('basket-ball');
  handleFiles(files: File[]): void {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file);
  });

  // Call your backend upload API here.
  // this.http.post('/api/upload', formData).subscribe(...);
}
}
