import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showWelcomeDialog = false;
  userName = '';

  ngOnInit() {
    // Check if a token exists in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      this.userName = token; // Set the user name from the token
      this.showWelcomeDialog = true; // Display the dialog
    }

    setTimeout(() => {
      this.closeWelcomeDialog();
    }, 3000);
  }

  closeWelcomeDialog() {
    this.showWelcomeDialog = false; // Close the dialog
  }
}
