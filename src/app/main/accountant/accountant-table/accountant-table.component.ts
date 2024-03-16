import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountantData } from 'src/app/services/accountant-data.model';
@Component({
  selector: 'app-accountant-table',
  templateUrl: './accountant-table.component.html',
  styleUrls: ['./accountant-table.component.css']
})
export class AccountantTableComponent {
  accountants: AccountantData[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const loggedInUserToken = localStorage.getItem('token');

    if (loggedInUserToken) {
      const storedData = localStorage.getItem(loggedInUserToken);

      if (storedData) {
        this.accountants = JSON.parse(storedData).accountantData;
      }
    }
  }

  onEdit(accountant: { code: number, name: string }) {
    this.router.navigate(['/accountantform', { code: accountant.code, name: accountant.name }]);
  }

  onDelete(accountant: { code: number, name: string }) {
    const loggedInUserToken = localStorage.getItem('token');

    if (loggedInUserToken) {
      const storedData = localStorage.getItem(loggedInUserToken);

      if (storedData) {
        const userData = JSON.parse(storedData);
        userData.accountantData = userData.accountantData.filter((a: { code: number; }) => a.code !== accountant.code);

        localStorage.setItem(loggedInUserToken, JSON.stringify(userData));
        this.accountants = userData.accountantData;
      }
    }
  }
}
