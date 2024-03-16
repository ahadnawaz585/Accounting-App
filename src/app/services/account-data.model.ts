export class Account {
  code: number | null = null;
  name: string = '';
  type: string = '';
  accountant:string=''

  constructor(init?: Partial<Account>) {
    Object.assign(this, init);
  }
}
