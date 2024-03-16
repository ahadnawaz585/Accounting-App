import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service'; // Import your AuthService

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isResponsive = false;
  showCoursesDropdown = false;
  showMoreDropdown = false;
  showServicesDropdown = false;
  showProfileDropdown = false; // Add this line

  constructor(private router: Router, private authService: AuthService) {} // Inject AuthService

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleResponsiveMenu() {
    this.isResponsive = !this.isResponsive;
  }

  toggleDropdown(menu: string) {
    if (menu === 'Accountant') {
      this.showCoursesDropdown = !this.showCoursesDropdown;
      this.showMoreDropdown = false;
      this.showServicesDropdown = false;
      this.showProfileDropdown = false;
    } else if (menu === 'More') {
      this.showMoreDropdown = !this.showMoreDropdown;
      this.showCoursesDropdown = false;
      this.showServicesDropdown = false;
      this.showProfileDropdown = false;
    } else if (menu === 'Services') {
      this.showServicesDropdown = !this.showServicesDropdown;
      this.showCoursesDropdown = false;
      this.showMoreDropdown = false;
      this.showProfileDropdown = false;
    } else if (menu === 'Profile') {
      this.showProfileDropdown = !this.showProfileDropdown;
      this.showCoursesDropdown = false;
      this.showMoreDropdown = false;
      this.showServicesDropdown = false;
    }
  }

  logout() {
    // Call the logout method from your AuthService to clear user authentication
    this.authService.logout();

    // Redirect to the login or home page after logout
    this.router.navigate(['/auth']); // Change the route to your login page
  }
}
