import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDataComponent } from './account-data.component';

describe('AccountDataComponent', () => {
  let component: AccountDataComponent;
  let fixture: ComponentFixture<AccountDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDataComponent]
    });
    fixture = TestBed.createComponent(AccountDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
