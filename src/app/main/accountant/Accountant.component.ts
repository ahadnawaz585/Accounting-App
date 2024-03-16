import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountantData } from 'src/app/services/accountant-data.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-accountant',
  templateUrl: './accountant.component.html',
  styleUrls: ['./accountant.component.css']
})
export class AccountantFormComponent {
  accountantCode: number | null = null;
  accountantName: string = '';
  accountantData: AccountantData[] = [];
  isEditMode: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  checkLocalStorage(token: string): boolean {
    return localStorage.getItem(token) !== null;
  }

  onSubmit() {
    let codeExists: boolean; 
  
    if (this.accountantCode !== null && this.accountantName) {
      if (this.isEditMode) {
        const existingAccountant = this.accountantData.find(accountant => accountant.code === this.accountantCode);
  
        if (!existingAccountant) {
          alert("Accountant with this code doesn't exist. You can only update existing accountants.");
        } else if (existingAccountant.name === this.accountantName) {
          this.isEditMode = false;
          this.router.navigate(['/accountant']);
        } else {
          codeExists = this.accountantData.some(accountant => accountant.code === this.accountantCode);
  
          if (codeExists) {
            if (existingAccountant.code === this.accountantCode) {
              existingAccountant.name = this.accountantName;
              this.saveAccountantDataToLocalStorage();
              this.accountantName = '';
              this.isEditMode = false;
              this.router.navigate(['/accountant']);
            } else {
              alert("Accountant with this code already exists. You cannot use the same code.");
            }
          } else {
            existingAccountant.name = this.accountantName;
            this.saveAccountantDataToLocalStorage();
            this.accountantCode = null;
            this.accountantName = '';
            this.isEditMode = false;
            this.router.navigate(['/accountant']);
          }
        }
      } else {
        codeExists = this.accountantData.some(accountant => accountant.code === this.accountantCode);
        this.router.navigate(['/accountant']);
        if (codeExists) {
          alert('Accountant with the same code already exists.');
        } else {
          const newAccountant = { code: this.accountantCode as number, name: this.accountantName };
          this.accountantData.push(newAccountant);
          this.saveAccountantDataToLocalStorage();
          this.accountantCode = null;
          this.accountantName = '';
          this.router.navigate(['/accountant']);
        }
      }
    } else {
      alert('Fill both fields!');
    }
  }
  
  saveAccountantDataToLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      const existingData = this.checkLocalStorage(token)
        ? JSON.parse(localStorage.getItem(token)!)
        : { accountantData: [] };

      existingData.accountantData = this.accountantData;

      localStorage.setItem(token, JSON.stringify(existingData));
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const code = params['code'];
      const name = params['name'];

      if (code && name) {
        this.accountantCode = +code ?? null;
        this.accountantName = name;
        this.isEditMode = true;
      }

      const token = localStorage.getItem('token');
      if (token) {
        if (this.checkLocalStorage(token)) {
          const storedData = JSON.parse(localStorage.getItem(token)!);

          if (storedData.accountantData) {
            this.accountantData = storedData.accountantData;
          }
        }
      }
    });
  }
}
