import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountantFormComponent} from './Accountant.component';

describe('AccountantComponent', () => {
  let component: AccountantFormComponent;
  let fixture: ComponentFixture<AccountantFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountantFormComponent]
    });
    fixture = TestBed.createComponent(AccountantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
