import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { NavbarComponent } from './main/navbar/navbar.component';
import { HomeComponent } from './main/home/home.component';
import { AccountantTableComponent } from './main/accountant/accountant-table/accountant-table.component';
import { AccountantFormComponent } from './main/accountant/Accountant.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard'; 
import { AuthService } from './auth/auth.service';
import { AccountDataComponent } from './main/account-data/account-data.component';
import { LedgerComponent } from './main/ledger/ledger.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent , canActivate: [AuthGuard] },
  { path: 'accountantform', component: AccountantFormComponent, canActivate: [AuthGuard] },
  { path: 'accountant', component: AccountantTableComponent, canActivate: [AuthGuard] },
  { path: 'accountanttable', component: AccountantTableComponent, canActivate: [AuthGuard] },
  { path: 'account', component: AccountDataComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: AuthComponent },
  {path : 'ledger' ,component: LedgerComponent, canActivate: [AuthGuard]}  
];


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    HomeComponent,
    AccountantTableComponent,
    AccountantFormComponent,
    AuthComponent,
    AccountDataComponent,
    LedgerComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
  ],
  providers: [AuthGuard, AuthService], // Provide the AuthGuard and AuthService
  bootstrap: [AppComponent],
})
export class AppModule {}
