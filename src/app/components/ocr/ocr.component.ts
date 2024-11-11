import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TesseractService } from '../../services/tesseract.service';

@Component({
  selector: 'app-ocr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.css'],
})
export class OcrComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  ocrResult: string = '';
  loading: boolean = false;
  tesseractTime: string = '';
  confidenceThreshold: number = 80;
  imageSrc: string = ''; // Define imageSrc to hold the image source

  constructor(private tesseractService: TesseractService) {}

  ngAfterViewInit() {
    // Ensuring canvas is initialized
    console.log(this.canvasElement);
  }

  async onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        this.loading = true;

        // Set the image source for preview
        this.imageSrc = e.target.result;

        const startTime = performance.now();
        const result = await this.tesseractService.recognizeImage(
          e.target.result
        );
        const endTime = performance.now();

        this.tesseractTime = `Tesseract Processing Time: ${(
          endTime - startTime
        ).toFixed(2)} ms`;

        // Filter words based on confidence threshold
        this.ocrResult = result.words
          .filter((word: any) => word.confidence >= this.confidenceThreshold)
          .map((word: any) => word.text)
          .join(' ');

        // Draw bounding boxes
        this.drawBoundingBoxes(result.words);

        this.loading = false;
      };
      reader.readAsDataURL(file);
    }
  }

  drawBoundingBoxes(words: any) {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const image = new Image();
    image.src = this.imageSrc; // Use imageSrc for the canvas

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      words.forEach((word: any) => {
        if (word.confidence >= this.confidenceThreshold) {
          // Draw the bounding box
          const { x0, y0, x1, y1 } = word.bbox;
          ctx.beginPath();
          ctx.rect(x0, y0, x1 - x0, y1 - y0);
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.stroke();
        }
      });
    };
  }
}
