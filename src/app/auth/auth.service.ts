import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;

  constructor() {
    this.isAuthenticated = localStorage.getItem('token') !== null;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  login(username: string, password: string): boolean {
    if (this.authenticateUser(username, password)) {
      const token = this.generateUniqueToken(username); // Generate a unique token using the username
      localStorage.setItem('token', token);
      this.isAuthenticated = true;
      return true;
    }
    return false;
  }
  

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  private authenticateUser(username: string, password: string): boolean {
    // Replace this with your authentication logic
    const validCredentials = true;

    if (validCredentials) {
      return true;
    } else {
      return false;
    }
  }

  private generateUniqueToken(username: string): string {
    // Generate a unique token by combining the username and a timestamp
    // const timestamp = new Date().getTime();
    const uniqueToken = `${username}`;
  
    return uniqueToken;
  }
  
}
