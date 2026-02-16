import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { SignupComponent } from './signup/signup';
import { ScamMapComponent } from './scam-map/scam-map';
import { TranslateComponent } from './translate/translate';
import { CurrencyConverterComponent } from './currency/currency';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'scam-map', component: ScamMapComponent },
  {
    path: 'translate',
    component: TranslateComponent
  },
  {
    path: "currency", component:  CurrencyConverterComponent
  },

  // Optional fallback (recommended)
  { path: '**', redirectTo: '' }
];
