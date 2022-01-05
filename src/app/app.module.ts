import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', component: AppComponent },
	{ path: '**', redirectTo: "/" },
];

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
