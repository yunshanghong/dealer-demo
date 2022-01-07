import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: '**', redirectTo: "/" },
];

@NgModule({
	declarations: [
		
		
		//#region Main page
		AppComponent,
		HomeComponent,
		//#endregion

		//#region Layouts
		HeaderComponent,
		FooterComponent,
		//#endregion
	],
	imports: [
		RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
