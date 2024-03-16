import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LedgerData } from 'src/app/services/ledger-data.model';
import { AccountantData } from 'src/app/services/accountant-data.model';
import { Account } from 'src/app/services/account-data.model';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent {

  ledger: LedgerData[];
  account: string;
  memo: string;
  amount: number;
  entryDate: string;
  totalAmount: number | null;
  selectedAccountant: string;
  accountantData: AccountantData[];
  accountOptions: string[];
  items: Account[];
  editIndex: number;
  editedEntry: LedgerData | null;
  selectedFilter: string;
  filteredLedger: LedgerData[];
  selectedDate: string;
  searchTerm: string;
  filterFormOpen: boolean;


  private getLedgerUrl = 'http://localhost:3000/api/ledger/getLedger';
  private createLedgerUrl = 'http://localhost:3000/api/ledger/createLedger';

  constructor(private http: HttpClient) {
    this.ledger = [];
    this.account = '';
    this.memo = '';
    this.amount = 0;
    this.entryDate = '';
    this.totalAmount = null;
    this.selectedAccountant = '';
    this.accountantData = [];
    this.accountOptions = [];
    this.items = [];
    this.editIndex = -1;
    this.editedEntry = null;
    this.selectedFilter = '';
    this.filteredLedger = [];
    this.selectedDate = '';
    this.searchTerm = '';
    this.filterFormOpen = false;
    // this.loadLedgerFromLocalStorage();
    this.loadLedgerFromLocalStorageAndAPI();
    this.loadAccountantNames();
    
    this.loadAccountNames();
  }


  loadAccountantNames() {
    const token = localStorage.getItem('token');
    if (token) {
      const existingData = this.checkLocalStorage(token)
        ? JSON.parse(localStorage.getItem(token)!)
        : { accountantData: [] };

      this.accountantData = existingData.accountantData;
      this.selectedAccountant = this.accountantData.length > 0 ? this.accountantData[0].name : '';

      this.filterAccounts();
    }
  }

  loadAccountNames() {
    const token = localStorage.getItem('token');
    if (token) {
      const existingData = this.checkLocalStorage(token)
        ? JSON.parse(localStorage.getItem(token)!)
        : { accountantData: [], items: [] };
  
      this.items = existingData.items; // Now items contain account codes
  
      this.accountantData = existingData.accountantData;
      this.selectedAccountant = this.items.length > 0 ? this.items[0].accountant : '';
      this.filterAccounts();
    }
  }
  
  

  filterEntries() {
    if (this.selectedFilter && this.selectedDate) {
      this.filteredLedger = this.ledger.filter(
        (entry) =>
          entry.account === this.selectedFilter &&
          entry.date === this.selectedDate
      );
    } else if (this.selectedFilter) {
      this.filteredLedger = this.ledger.filter(
        (entry) => entry.account === this.selectedFilter
      );
    } else if (this.selectedDate) {
      this.filteredLedger = this.ledger.filter(
        (entry) => entry.date === this.selectedDate
      );
    } else {
      this.filteredLedger = this.ledger;
    }
  
    this.calculateTotalAmount();
  }
  
  resetFilters() {
    this.selectedFilter = '';
    this.selectedDate = '';
    this.filterEntries();
  }
  

  filterAccounts() {
    const selectedAccountantData = this.accountantData.find(accountant => accountant.name === this.selectedAccountant);
  
    if (selectedAccountantData) {

      this.accountOptions = this.items
        .filter(item => item.accountant === selectedAccountantData.name)
        .map(item => item.name);
  

      if (this.selectedFilter) {
        this.filteredLedger = this.ledger.filter(entry => entry.account === this.selectedFilter);
      } else {

        this.filteredLedger = this.ledger;
      }
    } else {
      this.accountOptions = [];
      this.filteredLedger = [];
    }
    

    this.calculateTotalAmount();
  }
  
  toggleFilterForm() {
    this.filterFormOpen = !this.filterFormOpen;
  }
  
  searchEntries() {
    if (this.searchTerm) {
      this.filteredLedger = this.ledger.filter(
        (entry) => entry.account.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.searchTerm = '';
    } else {
      this.filteredLedger = this.ledger;
    }
    this.calculateTotalAmount();
  }
  
  

  addTransaction(accountant: string, account: string, memo: string, amount: number, entryDate: string) {
    if (!account || !memo || amount <= 0 || !entryDate || !accountant) {
      alert('Please enter values for all fields, including a positive amount, a date, and an accountant.');
      return;
    }

    const selectedAccountantData = this.accountantData.find(accountantData => accountantData.name === accountant);
    const accountCode = this.items.find(item => item.name === account)?.code;
    if (selectedAccountantData && accountCode) {
      
     if (this.editIndex === -1) {
      const newEntry = new LedgerData(selectedAccountantData.code, accountCode, account, memo, amount, entryDate);
      this.ledger.push(newEntry);
    } else {
      if (this.editedEntry) {
        this.editedEntry.Accountantcode = selectedAccountantData.code;
        this.editedEntry.Accountcode = accountCode; // Fix the property name here
        // this.editedEntry.account = account;
        this.editedEntry.memo = memo;
        this.editedEntry.amount = amount;
        this.editedEntry.date = entryDate;
      }
      this.editIndex = -1;
      this.editedEntry = null;
    }

    this.createLedgerEntry(selectedAccountantData.code, accountCode, account, memo, amount, entryDate);
  
      this.saveLedgerToLocalStorage();
      this.clearInputFields();
    }
  }
  
  createLedgerEntry(accountantCode: number, accountCode: number, account: string, memo: string, amount: number, entryDate: string) {
    const newLedgerEntry = { accountantCode, accountCode, account, memo, amount, entryDate };
  
    this.http.post(this.createLedgerUrl, newLedgerEntry)
      .subscribe(
        (response: any) => {
          console.log('Ledger entry created successfully:', response);
          // You can handle the response or add additional logic here
        },
        (error: any) => {
          console.error('Error creating ledger entry:', error);
          // Handle the error as needed
        }
      );
  }
  
  
  printLedger() {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
        <head>
          <title>Print Ledger</title>
          <link rel="stylesheet" type="text/css" href="print-styles.css"> <!-- Link to your print-specific CSS file -->
        </head>
        <style>
        /* print-styles.css */
body {
    font-family: Arial, sans-serif;
  }
  .logo-image {
    width: 100px; /* Adjust the width to your desired size */
    height: auto;
    margin: 0; /* Adjust the margin as needed */
    margin-top: -15px; /* Maintain the aspect ratio */
  }
  .print-header {
    text-align: center;
    padding: 20px;
    border-bottom: 2px solid #000;
  }
  
  h1 {
    text-align: center;
    font-size: 24px;
    margin: 20px 0;
    color: #000;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  
  table, th, td {
    border: 1px solid #000;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
  }
  
  thead {
    background-color: #f0f0f0;
  }
  
  .total-amount {
    text-align: right;
    font-weight: bold;
    margin-top: 20px;
    color: #000;
  }
  
        </style>
        <body>
          <div class="print-header">
            <img class="logo-image" src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png" alt="Your Logo">
            <h2>Accountant Name: ${this.selectedAccountant}</h2>
          </div>
          <h1>Ledgers:</h1>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th>Memo</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredLedger.map(entry => `
                <tr>
                  <td>${entry.account}</td>
                  <td>${entry.memo}</td>
                  <td>${entry.date}</td>
                  <td>${entry.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total-amount">
            Total Amount: ${this.calculateTotalAmount() || 0}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }
  
  

  // loadLedgerFromLocalStorage() {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const existingData = this.checkLocalStorage(token)
  //       ? JSON.parse(localStorage.getItem(token)!)
  //       : { ledger: [] };

  //     this.ledger = existingData.ledger;
  //   }
  // }
  loadLedgerFromLocalStorageAndAPI() {
    const token = localStorage.getItem('token');
    if (token) {
      const existingData = this.checkLocalStorage(token)
        ? JSON.parse(localStorage.getItem(token)!)
        : { ledger: [] };
  
      this.ledger = existingData.ledger;
  
      // Fetch data from the API
      this.http.get<LedgerData[]>(this.getLedgerUrl)
        .subscribe(
          (apiData: LedgerData[]) => {
            // Merge data from API with local storage data
            this.ledger = [...this.ledger, ...apiData];
            // Sort the ledger entries based on the date or any other criteria
            this.ledger.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            this.filterEntries(); // You may need to call filterEntries or any other necessary methods here
          },
          (error: any) => {
            console.error('Error loading ledger from API:', error);
            // Handle the error as needed
          }
        );
    }
  }
  

  editEntry(index: number) {
    this.editIndex = index;
    this.editedEntry = this.ledger[index];

    this.account = this.editedEntry.account;
    this.memo = this.editedEntry.memo;
    this.amount = this.editedEntry.amount;
    this.entryDate = this.editedEntry.date;
  }

  deleteEntry(index: number) {
    this.ledger.splice(index, 1);
    this.saveLedgerToLocalStorage();
    this.clearInputFields();
  }

  

  clearInputFields() {
    this.account = '';
    this.memo = '';
    this.amount = 0;
    this.entryDate = '';
  }

  saveLedgerToLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      const existingData = this.checkLocalStorage(token)
        ? JSON.parse(localStorage.getItem(token)!)
        : { ledger: [] };

      existingData.ledger = this.ledger;
      localStorage.setItem(token, JSON.stringify(existingData));
    }
  }

  checkLocalStorage(token: string): boolean {
    return localStorage.getItem(token) !== null;
  }

  calculateTotalAmount(): number | null {
    if (this.filteredLedger && this.filteredLedger.length > 0) {
      return this.filteredLedger.reduce((total, entry) => total + entry.amount, 0);
    } else {
      return null;
    }
  }
  
  
}
