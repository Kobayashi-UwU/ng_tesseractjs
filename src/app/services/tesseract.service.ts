import { Injectable } from '@angular/core';
import { createWorker, Worker } from 'tesseract.js';

@Injectable({
  providedIn: 'root',
})
export class TesseractService {
  tesseractTime: string = '';
  private worker!: Worker;

  constructor() {
    this.initializeWorker();
  }

  private async initializeWorker() {
    this.worker = await createWorker('eng+tha');
  }

  async recognizeImage(image: string) {
    const result = await this.worker.recognize(image);
    return result.data;
  }

  async terminateWorker() {
    await this.worker.terminate();
  }
}
