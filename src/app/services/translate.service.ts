import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map , tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  constructor(private http: HttpClient) {}

  translate(text: string, sourceLanguage: string, targetLanguage: string) {
    return this.http
      .post<{ translatedText: string }>(
        'http://localhost:9090/api/translate',
        {
          text,
          sourceLanguage,
          targetLanguage,
        }
      )
      .pipe(
        tap(res => console.log('Response from backend:', res)),
        map(res => res.translatedText) // 👈 unwrap here
      );
  }
}
