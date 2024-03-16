import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantTableComponent } from './accountant-table.component';

describe('AccountantTableComponent', () => {
  let component: AccountantTableComponent;
  let fixture: ComponentFixture<AccountantTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountantTableComponent]
    });
    fixture = TestBed.createComponent(AccountantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
