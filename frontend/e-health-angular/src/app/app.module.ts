import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './service/notification.service';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { UserComponent } from './component/user/user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { QuestionsComponent } from './component/questions/questions.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { DoctorsComponent } from './component/doctors/doctors.component';
import { DoctorProfileComponent } from './component/doctor-profile/doctor-profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxRatingStarsModule } from 'ngx-rating-stars';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { SettingsComponent } from './component/settings/settings.component';
import { MedicalMagazineComponent } from './component/medical-magazine/medical-magazine.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    DoctorsComponent,
    QuestionsComponent,
    NavBarComponent,
    DoctorProfileComponent,
    SettingsComponent,
    MedicalMagazineComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NotificationModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgxRatingStarsModule,
    NgxStarRatingModule,
  ],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    UserService,
    NotificationService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
