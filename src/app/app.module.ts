import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';


import {MatSelectModule} from '@angular/material/select';

import { SelectButtonModule } from 'primeng/selectbutton';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ToolbarComponent } from './home/components/toolbar/toolbar.component';
import { HeaderComponent } from './home/components/mobile/header/header.component';
import { InfoScreenComponent } from './home/components/mobile/info-screen/info-screen.component';
import { CircuitCardComponent } from './home/components/circuit-card/circuit-card.component';
import { Sec2contentComponent } from './home/components/sec2content/sec2content.component';
import { FormComponent } from './home/components/form/form.component';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToolbarComponent,
    HeaderComponent,
    InfoScreenComponent,
    CircuitCardComponent,
    Sec2contentComponent,
    FormComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SelectButtonModule,
    CheckboxModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
