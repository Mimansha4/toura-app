import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '../services/translate.service';
import { finalize } from 'rxjs/operators';
// import { Component, signal } from '@angular/core';

interface Language {
  label: string;
  value: string;
}

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translate.html',
  styleUrls: ['./translate.scss'],
})
export class TranslateComponent {
  text = '';
 translatedText = signal('');
loading = signal(false);


  languages: Language[] = [
    { label: 'English', value: 'English' },
    { label: 'Russian', value: 'Russian' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'French', value: 'French' },
    { label: 'German', value: 'German' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Arabic', value: 'Arabic' },
  ];

  sourceLanguage = 'English';
  targetLanguage = 'Russian';

  constructor(private translateService: TranslateService) {}

  

// translate() {
//   if (!this.text.trim()) return;

//   this.loading = true;
//   this.translatedText = '';


//   this.translateService
//     .translate(this.text, this.sourceLanguage, this.targetLanguage)
//     .pipe(
//       finalize(() => {
//         this.loading = false; // 👈 ALWAYS runs
//       })
//     )
//    .subscribe({
//  next: (res: string) => {
//   console.log('before set:', this.translatedText);
//   this.translatedText = res;
//   console.log('after set:', this.translatedText);
// },
//   error: (err) => {
//     console.error(err);
//     this.translatedText = 'Translation failed';
//   }
// });


// }
translate() {
  if (!this.text.trim()) return;

  this.loading.set(true);
  this.translatedText.set('');

  this.translateService
    .translate(this.text, this.sourceLanguage, this.targetLanguage)
    .subscribe({
      next: (res: string) => {
        this.translatedText.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.translatedText.set('Translation failed');
        this.loading.set(false);
      }
    });
}



swapLanguages() {
  [this.sourceLanguage, this.targetLanguage] =
    [this.targetLanguage, this.sourceLanguage];

  this.text = '';
  this.translatedText.set('');
  this.loading.set(false);
}


}

// export class TranslatePage {}
