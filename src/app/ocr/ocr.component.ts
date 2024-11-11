import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-ocr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css'],
})
export class OcrComponent {
  ocrResult: string | null = null;
  isLoading = false;
  imageSrc: string | null = null;
  tesseractProcessTime: string = '';

  @ViewChild('imageCanvasRef') imageCanvasRef:
    | ElementRef<HTMLCanvasElement>
    | undefined;
  @ViewChild('boundingBoxCanvasRef') boundingBoxCanvasRef:
    | ElementRef<HTMLCanvasElement>
    | undefined;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.isLoading = true;
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async processImage(image: string): Promise<void> {
    const startTime = performance.now();

    try {
      const {
        data: { text, words },
      } = await Tesseract.recognize(
        image,
        'eng+tha', // Languages (English + Thai)
        {
          langPath: 'assets/tessdata',
          logger: (m) => console.log(m),
        }
      );

      const endTime = performance.now(); // Calculate end time after OCR completes
      this.tesseractProcessTime = `Tesseract Processing Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;

      this.ocrResult = text;
      this.isLoading = false;

      // Schedule the bounding boxes to be drawn
      requestAnimationFrame(() => this.drawBoundingBoxes(words));
    } catch (err) {
      const endTime = performance.now(); // If there's an error, calculate end time anyway
      this.tesseractProcessTime = `Tesseract Processing Time: ${(
        endTime - startTime
      ).toFixed(2)} ms`;

      console.error('OCR failed:', err);
      this.isLoading = false;
    }
  }

  drawBoundingBoxes(words: any): void {
    const imageCanvas = this.imageCanvasRef?.nativeElement;
    const boundingBoxCanvas = this.boundingBoxCanvasRef?.nativeElement;

    if (imageCanvas && boundingBoxCanvas) {
      const imageCtx = imageCanvas.getContext('2d');
      const boundingBoxCtx = boundingBoxCanvas.getContext('2d');

      if (imageCtx && boundingBoxCtx) {
        const img = new Image();
        img.onload = () => {
          // Set canvas size to match the image size
          imageCanvas.width = img.width;
          imageCanvas.height = img.height;
          boundingBoxCanvas.width = img.width;
          boundingBoxCanvas.height = img.height;

          // Draw the image on the imageCanvas only once
          imageCtx.drawImage(img, 0, 0);

          // Clear the bounding box canvas before drawing
          boundingBoxCtx.clearRect(
            0,
            0,
            boundingBoxCanvas.width,
            boundingBoxCanvas.height
          );

          // Set properties for the bounding box
          boundingBoxCtx.lineWidth = 2;
          boundingBoxCtx.strokeStyle = 'red';

          // Loop through the words and draw bounding boxes
          words.forEach((word: any) => {
            const bbox = word.bbox; // Bounding box coordinates
            if (bbox) {
              const { x0, y0, x1, y1 } = bbox; // Top-left and bottom-right coordinates
              // Draw the bounding box
              boundingBoxCtx.strokeRect(x0, y0, x1 - x0, y1 - y0);
            }
          });
        };
        img.src = this.imageSrc as string;
      }
    }
  }
}
