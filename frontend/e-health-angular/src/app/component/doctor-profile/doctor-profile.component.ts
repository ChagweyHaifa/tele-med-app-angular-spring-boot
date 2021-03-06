import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Doctor } from 'src/app/model/doctor';
import { NotificationService } from 'src/app/service/notification.service';
import { UserService } from 'src/app/service/user.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Role } from 'src/app/enum/role.enum';
import { Speciality } from 'src/app/model/speciality';
import { City } from 'src/app/model/city';
import { Country } from 'src/app/model/country';
import { State } from 'src/app/model/state';
import { FormService } from 'src/app/service/form.service';

import { RatingService } from 'src/app/service/rating.service';
import { Rating } from 'src/app/model/rating';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { HeaderType } from 'src/app/enum/header-type.enum';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css'],
})
export class DoctorProfileComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  showLoading: boolean = false;

  loggedInUser = this.authenticationService.getUserFromLocalCache();
  doctor: Doctor = new Doctor();
  ratings: Rating[];
  doctorUsername: string;

  specialities: Speciality[];
  countries: Country[];
  states: State[];
  cities: City[];
  profileImage: File;

  public editRatingForm: FormGroup;
  public addRatingForm: FormGroup;
  myRating: Rating;

  editDoctorProfileForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private userService: UserService,
    private ratingService: RatingService,
    private authenticationService: AuthenticationService,
    private formService: FormService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.addRatingForm = this.formBuilder.group({
      rating: ['', Validators.required],
      review: '',
    });

    this.editRatingForm = this.formBuilder.group({
      rating: ['', Validators.required],
      review: '',
    });

    this.editDoctorProfileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],

      speciality: this.formBuilder.group({
        id: new FormControl(''),
        name: new FormControl([Validators.required]),
      }),
      gender: ['', [Validators.required]],

      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      address: this.formBuilder.group({
        id: new FormControl(''),
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required]),
      }),

      active: [[Validators.required]],
      notLocked: [[Validators.required]],
    });
  }

  ngOnInit(): void {
    // console.log(this.isLoggedIn);
    this.route.paramMap.subscribe(() => {
      this.doctorUsername = this.route.snapshot.paramMap.get('username');
      this.getDoctorInfo();
      this.getDoctorRatings();
    });
  }

  getDoctorInfo() {
    this.subscriptions.push(
      this.userService.getDoctorInfo(this.doctorUsername).subscribe(
        (response: Doctor) => {
          this.doctor = response;
          // console.log(this.doctor);
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

  getDoctorRatings() {
    this.subscriptions.push(
      this.ratingService.getDoctorRatings(this.doctorUsername).subscribe(
        (response: Rating[]) => {
          this.ratings = response;
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

  addOrEditDoctorRating() {
    if (!this.authenticationService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    for (let rating of this.ratings) {
      if (rating.user.username == this.loggedInUser.username) {
        this.myRating = rating;
        this.editRatingForm.patchValue({
          rating: rating.rating,
          review: rating.review,
        });
        this.clickButton('edit-doctor-rating-btn');
        return;
      }
    }
    this.clickButton('add-doctor-rating-btn');
  }

  addRating() {
    const rating = new Rating();
    rating.rating = this.addRatingForm.value.rating;
    rating.review = this.addRatingForm.value.review;
    rating.doctor.username = this.doctorUsername;
    this.subscriptions.push(
      this.ratingService.addRating(rating).subscribe(
        (response: Doctor) => {
          this.getDoctorRatings();
          this.doctor = response;
          this.clickButton('add-rating-modal-close-btn');
          this.addRatingForm.reset();
          this.sendNotification(
            NotificationType.SUCCESS,
            'You have successfully rated this doctor'
          );
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

  editRating() {
    // const myRating = new Rating();
    this.myRating.rating = this.editRatingForm.value.rating;
    this.myRating.review = this.editRatingForm.value.review;
    this.myRating.doctor.username = this.doctorUsername;
    this.subscriptions.push(
      this.ratingService.editRating(this.myRating).subscribe(
        (response: Doctor) => {
          // this.getDoctorRatings();
          this.doctor = response;
          this.clickButton('edit-rating-modal-close-btn');
          this.editRatingForm.reset();
          this.sendNotification(
            NotificationType.SUCCESS,
            'You have successfully edited your rating'
          );
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

  deleteRating() {
    this.subscriptions.push(
      this.ratingService.deleteRating(this.doctorUsername).subscribe(
        (response: Doctor) => {
          this.doctor = response;
          this.getDoctorRatings();
          this.clickButton('edit-rating-modal-close-btn');
          this.sendNotification(
            NotificationType.SUCCESS,
            'You have deleted you rating successfully'
          );
        },
        (errorResponse: HttpErrorResponse) => {
          // console.log(errorResponse);
          this.sendNotification(
            NotificationType.ERROR,
            errorResponse.error.message
          );
        }
      )
    );
  }

  // edit doctor profile

  resetAddress(address: string) {
    switch (address) {
      case 'country': {
        this.f.address.patchValue({
          state: '',
          city: '',
          street: '',
        });
        break;
      }
      case 'state': {
        this.f.address.patchValue({
          city: '',
          street: '',
        });
        break;
      }
      case 'city': {
        this.f.address.patchValue({
          street: '',
        });
        break;
      }
    }
  }

  getSpecialities() {
    this.subscriptions.push(
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
    this.subscriptions.push(
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
    this.subscriptions.push(
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
    this.subscriptions.push(
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

  launchEditDoctorProfileModal() {
    this.getSpecialities();
    this.getCountries();
    this.getStates(this.doctor.address.country);
    this.getCities(this.doctor.address.state);
    this.editDoctorProfileForm.patchValue(this.doctor);
  }

  clickDoctorProfileSubmitBtn() {
    this.clickButton('edit-doctor-profile-submit-btn');
  }

  get f() {
    return this.editDoctorProfileForm.controls;
  }

  editDoctorProfile() {
    this.submitted = true;
    if (this.editDoctorProfileForm.invalid) {
      return;
    }
    console.log(this.editDoctorProfileForm.value);
    this.showLoading = true;
    this.subscriptions.push(
      this.userService
        .updateDoctor(this.editDoctorProfileForm.value, null)
        .subscribe(
          (response: HttpResponse<Doctor>) => {
            this.getDoctorInfo();
            this.showLoading = false;
            const token = response.headers.get(HeaderType.JWT_TOKEN);
            this.authenticationService.saveToken(token);
            this.clickButton('edit-doctor-profile-close-btn');
            this.sendNotification(
              NotificationType.SUCCESS,
              'you have successfully updated your profile'
            );
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

  // update profile image

  clickProfileImageBtn() {
    this.clickButton('profile-image-input');
  }

  public onUpdateProfileImage(event: Event): void {
    this.profileImage = (<HTMLInputElement>event.target).files[0];
  }

  updateProfileImage() {
    const formData = new FormData();
    formData.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (response: Doctor) => {
          this.doctor.profileImageUrl = `${
            response.profileImageUrl
          }?time=${new Date().getTime()}`;
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

  get isDoctor() {
    if (this.loggedInUser != null) {
      if (this.loggedInUser.role == 'ROLE_DOCTOR') return true;
    }
    return false;
  }

  get isAdmin() {
    if (this.loggedInUser != null) {
      if (this.loggedInUser.role == 'ROLE_ADMIN') return true;
    }
    return false;
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

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  private clickButton(buttonId: string) {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
