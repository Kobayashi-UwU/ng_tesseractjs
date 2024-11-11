import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { OcrComponent } from './ocr/ocr.component'; // Import the OCR component

@NgModule({
  declarations: [
    AppComponent,
    OcrComponent, // Declare the OCR component
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
