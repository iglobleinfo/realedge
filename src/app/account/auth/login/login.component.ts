import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { login } from 'src/app/store/Authentication/authentication.actions';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { SharedService } from 'src/app/shared/shared.service';
import { LoaderComponent } from "../../../shared/ui/loader/loader.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})

/**
 * Login component
 */
export class LoginComponent implements OnInit, AfterViewInit {
  doLoginArr: any = [];
  loginForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  returnUrl: string;
  fieldTextType!: boolean;
  loading = false; // Add this in your component


  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService, private store: Store,
    private sharedService: SharedService, private loginService: LoginService) { }

  ngOnInit() {
    // if (localStorage.getItem('currentUser')) {
    //   console.log(localStorage.getItem('currentUser'))
    //   this.router.navigate(['/predictedge']);
    // }
    // form validation
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required, Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3}))$/)])],
      password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(15)]],
    });
  }
  ngAfterViewInit() {
    // if (localStorage.getItem('currentUser')) {
    //   console.log('User exists, redirecting...');
    //   this.router.navigate(['/predictedge']);
    // }
  }
  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      let errorMessage = '';

      if (this.f['username'].errors) {
        if (this.f['username'].errors['required']) {
          errorMessage += 'Username is required.<br>';
        }
        if (this.f['username'].errors['username']) {
          errorMessage += 'Please enter a valid username.<br>';
        }
      }

      if (this.f['password'].errors) {
        if (this.f['password'].errors['required']) {
          errorMessage += 'Password is required.<br>';
        }
        if (this.f['password'].errors['minlength']) {
          errorMessage += 'Password must be at least 7 characters long.<br>';
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        html: errorMessage,
      }); return;
    }
    this.doLogin();
  }

  /**
 * Password Hide/Show
 */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  // doLogin() {
  //   // this.submitted = true;
  //   // if(this.loginForm.invalid){
  //   //   alert('jjj')
  //   //   return;
  //   // }
  //   this.loading = true; // Disable the button
  //   console.log(this.loginForm)
  //   this.loginService.doLogin(this.loginForm.value.username, this.loginForm.value.password).subscribe((res: any) => {
  //     // console.log(res);
  //     this.doLoginArr =res;
  //     this.loading = false; // Disable the button
  //     localStorage.setItem('currentUser', JSON.stringify(res));
  //     console.log( this.doLoginArr)
  //     this.sharedService.updateSessionData(res);
  //     this.getUserContext(res.userId, res.access_token);

  //   },
  //     (error: any) => {
  //       console.log(error);
  //       alert('Invalid creditionals please try again');

  //     }
  //   )
  // }
  doLogin() {
    this.loading = true; // Start loading

    // Show a SweetAlert loading message
    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait while we verify your credentials.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Show the loading animation
      },
    });

    this.loginService.doLogin(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      (res: any) => {
        this.doLoginArr = res;
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.sharedService.updateSessionData(res);
        this.router.navigate(['/predictedge']); // Redirect after user context loads
        // Show success message and wait for it to close before calling getUserContext
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          timer: 1000, // Auto close after 1 second
          showConfirmButton: false, // Hide "OK" button
        }).then(() => {
          // Call user context after Swal closes
          // this.router.navigate(['/predictedge']); // Redirect after user context loads
          this.getUserContext(res.userId, res.access_token);
        });
      },
      (error: any) => {
        this.loading = false;
        console.error(error);

        // Show error alert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid credentials, please try again.',
        });
      }
    );
  }

  getUserContext(userId: any, access_token: any) {
    this.loginService.getUserContext(userId, access_token).subscribe(
      (res: any) => {
        console.log(res);
        this.sharedService.updateAdminData(res);
        this.loading = false; // Stop loading
        // this.router.navigate(['/predictedge']); // Redirect after user context loads
      },
      (error: any) => {
        this.loading = false; // Stop loading even if there's an error
        console.error(error);

        Swal.fire({
          icon: 'error',
          title: 'Error Fetching Data',
          text: 'Failed to retrieve user context. Please try again.',
        });
      }
    );
  }

  // doLogin() {
  //   this.loading = true; // Start loading

  //   // Show a SweetAlert loading message
  //   Swal.fire({
  //     title: 'Logging in...',
  //     text: 'Please wait while we verify your credentials.',
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading(); // Show the loading animation
  //     },
  //   });

  //   this.loginService.doLogin(this.loginForm.value.username, this.loginForm.value.password).subscribe(
  //     (res: any) => {
  //       this.doLoginArr = res;
  //       localStorage.setItem('currentUser', JSON.stringify(res));
  //       this.sharedService.updateSessionData(res);

  //       // Update Swal when login is successful
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Login Successful',
  //         text: 'Welcome back!',
  //         timer: 1000, // Auto close after 1 second
  //         showConfirmButton: false, // Hide "OK" button
  //       }).then(() => {
  //         this.getUserContext(res.userId, res.access_token);
  //       });
  //     },
  //     (error: any) => {
  //       this.loading = false;
  //       console.log(error);

  //       // Show error alert
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Login Failed',
  //         text: 'Invalid credentials, please try again.',
  //       });
  //     }
  //   );
  // }

  // getUserContext(userId: any, access_token: any) {
  //   this.loginService.getUserContext(userId, access_token).subscribe((res: any) => {
  //     console.log(res);
  //     this.sharedService.updateAdminData(res);
  //     this.loading = false;
  //     this.router.navigate(['/predictedge']);
  //   },
  //     (error: any) => {
  //       console.log(error);
  //       alert('Invalid creditionals please try again');

  //     }
  //   )

  // }
}
