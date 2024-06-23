import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PaymentHomeComponent } from './paymentPage/home/home.component';
import { LoginComponent } from './login/components/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RunnersComponent } from './dashboard/runners/runners.component';
import { CategoriesComponent } from './dashboard/categories/categories.component';
import { PricesComponent } from './dashboard/prices/prices.component';
import { SponsorsComponent } from './dashboard/sponsors/sponsors.component';
import { UiComponent } from './dashboard/ui/ui.component';
import { ConfirmationComponent } from './paymentPage/confirmation/confirmation.component';
import { WalkaroundComponent } from './paymentPage/walkaround/walkaround.component';
import { ResultadosComponent } from './resultados/resultados.component';
import { ResultComponent } from './resultados/result/result.component';

const routes: Routes = [
  { path: '',         component: DashboardComponent},
  { path: 'payment',  component:PaymentHomeComponent },
  { path: 'confirmation/:param?/:id?', component: ConfirmationComponent},
  { path: 'walk/:runner', component: WalkaroundComponent},
  { path: 'login',    component: LoginComponent},
  { path: 'resultados', component: ResultadosComponent, children: [

  ]},
  { path: 'result/:runner', component: ResultComponent},
  { path: 'dashboard', component: DashboardComponent, children: [
    {path: 'runners', component: RunnersComponent},
    {path: 'categories', component: CategoriesComponent},
    {path: 'pricing', component: PricesComponent},
    {path: 'sponsors', component: SponsorsComponent},
    {path: 'ui', component: UiComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
