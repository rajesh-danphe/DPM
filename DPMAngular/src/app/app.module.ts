import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppComponent } from './app.component';
import {LoginComponent} from './Login/login.component'
import {AppRoutingModule} from './app.routing'
import {HttpClientModule,HttpClientXsrfModule} from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({cookieName: 'csrftoken', headerName: 'X-CSRFToken'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
