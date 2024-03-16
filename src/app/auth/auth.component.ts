import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  constructor(private router: Router, private authService: AuthService) {}


  userData: any = {};
  showSuccessMessage: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  mode: 'login' | 'signup' = 'login';

  onSubmit() {
    if (!this.userData.username || !this.userData.email || !this.userData.password || !this.userData.confirmPassword) {
      this.errorMessage = ''; // Clear any previous error message
      this.errorMessage = "";
      return;
    }
  
    if (this.userData.password !== this.userData.confirmPassword) {
      this.errorMessage = ''; // Clear any previous error message
      this.errorMessage = "Passwords do not match";
      return;
    }
  
    let users = JSON.parse(localStorage.getItem('users') || '[]');
  
    // Check if the username or email already exists
    const existingUser = users.find((user: any) => user.username === this.userData.username || user.email === this.userData.email);
    if (existingUser) {
      this.errorMessage = ''; // Clear any previous error message
      this.errorMessage = "Username or email already exists.";
      return;
    } 
  
    // Create a new user object and add it to the array
    const newUser = {
      username: this.userData.username,
      email: this.userData.email,
      password: this.userData.password
    };
  
    // Add the new user to the array
    users.push(newUser);
  
    // Save the updated users array to local storage
    localStorage.setItem('users', JSON.stringify(users));
  
    // Set the success message flag to true
    this.errorMessage = ''; 
  this.showSuccessMessage = true;
  setTimeout(() => {
    this.mode = 'login';
  }, 500);
    this.userData = {};
  }
  
  onLogin(username: string, password: string) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
  
    if (user) {
      this.authService.login(username, password); // Set the user as authenticated
      this.successMessage = 'Login successful!';
      this.errorMessage = ''; // Clear any previous error message
  
      // Check if the user's data already exists in localStorage
      let userData: any | null = JSON.parse(localStorage.getItem(username)!);
  
      if (!userData) {
        // If the user's data doesn't exist, create a new object for them
        userData = {
          accountantData: [],
          items: [],
          ledger:[]
        };
  
        // Save the user's data in localStorage
        localStorage.setItem(username, JSON.stringify(userData));
      }
  
      this.router.navigate(['/']);
    } else {
      // Incorrect credentials
      this.errorMessage = 'Invalid username or password.';
      this.successMessage = ''; // Clear any previous success message
    }
    this.userData = {};
  }
  
  
  
  

  toggleMode() {
    this.successMessage = '';
    this.showSuccessMessage=false;
    this.errorMessage = '';
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.userData = {};
  }
}
