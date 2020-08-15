import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdminComponent} from './Admin/admin.component';
import {UserComponent} from './User/user.component';
import {MainAppComponent} from './main-app.component';
import {MainAppRoutingModule} from './main-app.routing';
import {FormsModule} from '@angular/forms';
@NgModule({
    declarations:[AdminComponent,UserComponent,MainAppComponent],
    imports:[
        CommonModule,
        MainAppRoutingModule,
        FormsModule
    ],
    bootstrap:[MainAppComponent]
})
export class MainAppModule{

}