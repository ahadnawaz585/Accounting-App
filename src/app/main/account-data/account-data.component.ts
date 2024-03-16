import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccountantData } from 'src/app/services/accountant-data.model';
import { Account } from 'src/app/services/account-data.model';

@Component({
  selector: 'app-account-data',
  templateUrl: './account-data.component.html',
  styleUrls: ['./account-data.component.css']
})
export class AccountDataComponent implements OnInit {

  items: any[] = [];
  filteredItems: any[] = [];
  editedItemIndex: number | null = null as number | null;
  isEditMode: boolean = false;
  accountant: AccountantData = new AccountantData(0, '');
  addFormData: Account = new Account();
  filterType: string = "";
  sortedColumn: string | null = null;
  isSortAscending: boolean = true;
  selectedAccountant: string = '';
  accountantData: AccountantData[] = [];
  accountTypes: string[] = ["Expenses", "Revenue", "Assets", "COGS"];
  accountSubtypes: string[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  refresh(){
    location.reload();
  }

  ngOnInit() {
    this.loadAccountDataFromLocalStorage();
    this.filteredItems = [...this.items];
    this.loadAccountantNames();
  }

  loadAccountantNames() {
    const token = localStorage.getItem('token');
    if (token) {
      const existingData = this.checkLocalStorage(token)
        ? JSON.parse(localStorage.getItem(token)!)
        : { accountantData: [] };

      this.accountantData = existingData.accountantData;
      this.selectedAccountant = this.accountantData.length > 0 ? this.accountantData[0].name : '';
      this.applyFilter();
    }
  }
  

  loadAccountDataFromLocalStorage() {
    const loggedInUserToken = localStorage.getItem('token');
    if (loggedInUserToken) {
      const storedData = localStorage.getItem(loggedInUserToken);

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData.items) {
          this.addFormData = parsedData.items;
          this.items = parsedData.items;
        }
      }
    }
  }

  checkLocalStorage(token: string): boolean {
    return localStorage.getItem(token) !== null;
  }

  saveAccountDataToLocalStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      const existingData = this.checkLocalStorage(token)
        ? JSON.parse(localStorage.getItem(token)!)
        : { items: [] };
  
      existingData.items = this.items;
      localStorage.setItem(token, JSON.stringify(existingData));
    }
  }
  

  addItem() {
    if (!this.isEditMode && this.validateForm()) {
      const newItem = new Account({
        code: this.addFormData.code,
        name: this.addFormData.name,
        type: this.addFormData.type,
        accountant: this.selectedAccountant // Set the accountant property here
      });
      this.items.push(newItem);
      this.saveAccountDataToLocalStorage();
      this.clearFormFields();
      this.refresh();
    } else if (this.isEditMode) {
      this.saveEditedItem();
      this.refresh();
    }
  }
  
  
  
  editItem(index: number) {
    this.editedItemIndex = index;
    this.addFormData = new Account({ ...this.items[index] });
    this.isEditMode = true;
  }
  

  saveEditedItem() {
    if (this.isEditMode && this.editedItemIndex !== null) {
      if (this.validateForm()) {
        const editedItem = this.items[this.editedItemIndex];
        // Remove "subtype" references here
        const hasChanged =
          editedItem.code !== this.addFormData.code ||
          editedItem.name !== this.addFormData.name ||
          editedItem.type !== this.addFormData.type;
  
        if (!hasChanged) {
          // If no changes are detected, simply clear the form fields
          this.clearFormFields();
          this.editedItemIndex = null;
          this.isEditMode = false;
        } else {
          // Check for duplicate codes
          const codeExists = this.items.some((item, index) => {
            return (
              index !== this.editedItemIndex &&
              item.code === this.addFormData.code
            );
          });
  
          if (codeExists) {
            alert("An item with this code already exists. You cannot use the same code.");
          } else {
            // Update the item in the items array
            editedItem.code = this.addFormData.code;
            editedItem.name = this.addFormData.name;
            editedItem.type = this.addFormData.type;
  
            this.saveAccountDataToLocalStorage();
            this.clearFormFields();
            this.editedItemIndex = null;
            this.isEditMode = false;
            this.refresh();
          }
        }
      }
    }
  }
   
  cancelEdit() {
    this.clearFormFields();
    this.editedItemIndex = null;
    this.isEditMode = false;
    this.refresh();
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
    this.saveAccountDataToLocalStorage();
    this.refresh();
  }
  

  private clearFormFields() {
    this.addFormData = {
      code: null,
      name: '',
      type: '',
      accountant:''
    };
  }

  private validateForm(): boolean {
    if (!this.addFormData.code || !this.addFormData.name || !this.addFormData.type) {
      alert('All fields are required.');
      return false;
    }

    const codeExists = this.items.some((item, index) => {
      return index !== this.editedItemIndex && item.code === this.addFormData.code;
    });

    if (codeExists) {
      alert('Code must be unique.');
      return false;
    }

    return true;
  }
  applyFilter() {
    // Modify the filter to consider only the "type" property
    if (this.filterType) {
      this.filteredItems = this.items.filter((item) => {
        return item.type === this.filterType;
      });
    } else {
      this.filteredItems = [...this.items];
    }
  }
  
  sortData(column: string) {
    if (this.sortedColumn === column) {
      // Reverse the sorting order if the same column is clicked
      this.isSortAscending = !this.isSortAscending;
    } else {
      this.sortedColumn = column;
      this.isSortAscending = true;
    }
    this.changeDetector.detectChanges();
    // Sort the data
    this.filteredItems = this.filteredItems.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) {
        return this.isSortAscending ? -1 : 1;
      } else if (aValue > bValue) {
        return this.isSortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
