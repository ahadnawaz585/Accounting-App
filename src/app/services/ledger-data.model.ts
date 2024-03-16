export class LedgerData {
  Accountantcode: number;
  Accountcode: number; 
  account: string;
  memo: string;
  amount: number;
  date: string;

  constructor(code: number, acode:number ,account: string, memo: string, amount: number, date: string) {
    this.Accountantcode = code;
    this.Accountcode = acode;
    this.account = account;
    this.memo = memo;
    this.amount = amount;
    this.date = date;
  }
}
