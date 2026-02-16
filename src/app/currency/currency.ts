import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './currency.html',
  styleUrls: ['./currency.scss']
})


export class CurrencyConverterComponent {

  currencies = [
    { label: 'USD - US Dollar', value: 'USD' },
    { label: 'INR - Indian Rupee', value: 'INR' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'GBP - British Pound', value: 'GBP' },
    { label: 'JPY - Japanese Yen', value: 'JPY' }
  ];

  fromCurrency = 'USD';
  toCurrency = 'INR';

  amount = 1;

  convertedAmount = signal<number | null>(null);
  exchangeRate = signal<number | null>(null);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  swapCurrencies() {
    [this.fromCurrency, this.toCurrency] =
      [this.toCurrency, this.fromCurrency];

    if (this.convertedAmount()) {
      this.convert();
    }
  }

  convert() {
    this.loading.set(true);

    const url =
      `http://localhost:9090/api/currency/convert` +
      `?from=${this.fromCurrency}` +
      `&to=${this.toCurrency}` +
      `&amount=${this.amount}`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        this.convertedAmount.set(res.convertedAmount);
        this.exchangeRate.set(res.exchangeRate);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
