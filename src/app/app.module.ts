import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AutofocusModule} from 'angular-autofocus-fix';
import {RouterModule, Routes} from '@angular/router';

import {TodoComponent} from './todo/todo.component';
import {TodoService} from './todo.service';
import {AppComponent} from './app.component';


const routes: Routes = [
	{path: '', component: TodoComponent, pathMatch: 'full'},
	{path: ':filter', component: TodoComponent}
];

@NgModule({
	declarations: [
		AppComponent,
		TodoComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		AutofocusModule,
		RouterModule.forRoot(routes, {useHash: true})
	],
	providers: [TodoService],
	bootstrap: [AppComponent]
})
export class AppModule {}
