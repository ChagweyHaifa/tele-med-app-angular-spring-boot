import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Address } from 'src/app/model/address';
import { City } from 'src/app/model/city';
import { Country } from 'src/app/model/country';
import { Doctor } from 'src/app/model/doctor';
import { Speciality } from 'src/app/model/speciality';
import { State } from 'src/app/model/state';
import { User } from 'src/app/model/user';
import { Visitor } from 'src/app/model/visitor';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { FormService } from 'src/app/service/form.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  showLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  specialities: Speciality[];
  defaultCountry: string = 'Tunisie';
  countries: Country[];
  states: State[];
  cities: City[];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.getSpecialities();
    this.getCountries();

    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }

  getSpecialities() {
    this.subs.add(
      this.formService.getSpecialities().subscribe(
        (response: Speciality[]) => {
          this.specialities = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
        }
      )
    );
  }

  getCountries() {
    this.subs.add(
      this.formService.getCountries().subscribe(
        (response: Country[]) => {
          this.countries = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
        }
      )
    );
  }

  getStates(countryName: string) {
    this.subs.add(
      this.formService.getStates(countryName).subscribe(
        (response: State[]) => {
          this.states = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
        }
      )
    );
  }

  getCities(stateName: string) {
    this.subs.add(
      this.formService.getCities(stateName).subscribe(
        (response: City[]) => {
          this.cities = response;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
        }
      )
    );
  }

  onRegisterVisitor(user: User) {
    console.log(user);
    this.showLoading = true;
    this.subs.add(
      this.authenticationService.registerUser(user).subscribe(
        (response: User) => {
          // console.log(response);
          this.showLoading = false;
          this.sendNotification(
            NotificationType.SUCCESS,
            `A new account was created for ${response.firstName}`
          );
          this.router.navigateByUrl('/login');
        },
        (errorResponse: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
        }
      )
    );
  }

  onRegisterDoctor(form: NgForm) {
    let newDoctor = new Doctor();
    newDoctor.username = form.value.username;
    newDoctor.firstName = form.value.firstName;
    newDoctor.lastName = form.value.lastName;
    newDoctor.email = form.value.email;
    newDoctor.phoneNumber = form.value.phoneNumber;
    newDoctor.gender = form.value.gender;
    newDoctor.speciality = form.value.speciality;
    newDoctor.password = form.value.password;
    let address = new Address();
    address.country = form.value.country;
    address.state = form.value.state;
    address.city = form.value.city;
    address.street = form.value.street;
    newDoctor.address = address;
    console.log(newDoctor);
    this.showLoading = true;
    this.subs.add(
      this.authenticationService.registerDoctor(newDoctor).subscribe(
        (response: Doctor) => {
          // console.log(response);
          this.showLoading = false;
          this.sendNotification(
            NotificationType.SUCCESS,
            `A new account was created for ${response.firstName}.
          Please check your email`
          );
          form.reset();
          this.router.navigateByUrl('/login');
        },
        (errorResponse: HttpErrorResponse) => {
          this.showLoading = false;
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
        }
      )
    );
  }

  private sendNotification(
    notificationType: NotificationType,
    message: string
  ): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      // if we didn't get any message from the backend, for example in case we didn't start the backend server
      this.notificationService.notify(
        notificationType,
        'An error occurred. Please try again.'
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
