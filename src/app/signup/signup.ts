import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { RouterModule } from '@angular/router';   // 🔥 REQUIRED

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
 
@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,           // 🔥 THIS FIXES routerLink
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ]
})
export class SignupComponent {
 
  signupForm: FormGroup;
 
  countries: string[] = [
    'India',
    'USA',
    'UK',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Japan'
  ];
 
  constructor(private fb: FormBuilder) {
 
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]]
    });
  }
 
  onSubmit(): void {
 
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
 
    console.log('Signup Data:', this.signupForm.value);
 
    alert('Signup Successful!');
    this.signupForm.reset();
  }
}