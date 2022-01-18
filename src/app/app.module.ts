import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { LoginComponent } from './main/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './services/token.interceptor';
import { ForgetPasswordComponent } from './main/forgetPassword/forgetPassword.component';
import { ChangePasswordComponent } from './main/changePassword/changePassword.component';
import { PersonalInfoComponent } from './main/personalInfo/personalInfo.component';
import { LoginGuard } from './auth/login.guard';
import { DateTimePipe } from './pipes/viewData.pipe';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [LoginGuard] },
	{ path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
	{ path: 'forgetPassword', component: ForgetPasswordComponent, canActivate: [LoginGuard] },
	{ path: 'personalInfo', component: PersonalInfoComponent, canActivate: [LoginGuard] },
	{ path: 'changePassword', component: ChangePasswordComponent, canActivate: [LoginGuard] },
	{ path: '**', redirectTo: "/", canActivate: [LoginGuard] },
];

@NgModule({
	declarations: [

		//#region Main page
		AppComponent,
		HomeComponent,
		LoginComponent,
		ChangePasswordComponent,
		ForgetPasswordComponent,
		PersonalInfoComponent,
		//#endregion

		//#region Layouts
		HeaderComponent,
		FooterComponent,
		//#endregion

		DateTimePipe,
	],
	imports: [
		RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
    	HttpClientModule,
    	FormsModule,
		ReactiveFormsModule,
	],
	providers: [
    	{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true, },
    	LoginGuard,

	],
	bootstrap: [AppComponent]
})
export class AppModule { }
