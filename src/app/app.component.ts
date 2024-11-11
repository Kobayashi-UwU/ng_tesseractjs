import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { OcrComponent } from './ocr/ocr.component'; // Import the OCR component

@Component({
  selector: 'app-root',
  standalone: true, // Make it standalone
  imports: [CommonModule, OcrComponent], // Add CommonModule and OcrComponent here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ocr-angular-app';
}
