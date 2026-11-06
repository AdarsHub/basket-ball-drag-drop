import { CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CdkDrag, CdkDropList, CdkDragPreview, MatIconModule],
  selector: 'app-file-basket',
  styleUrl: './file-basket.scss',
  templateUrl: './file-basket.html',
})
export class FileBasket {
  selectedFiles: File[] = [];

  onBasketDrop(event: CdkDragDrop<File[], File[], File>): void {
    const file = event.item.data as File | undefined;

    if (!file) {
      return;
    }

    this.selectedFiles = [...this.selectedFiles, file];
  }
}
