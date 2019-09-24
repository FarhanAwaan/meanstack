import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  email: String;
  password: String;
  userName: String;

  constructor( private validateService: ValidateService,
               private flashMessage: FlashMessagesService,
               private authService: AuthService,
               private router: Router
               ) { }

  ngOnInit() {
  }

  onRegister() {
    const newUser = {
      name: this.name,
      email: this.email,
      username: this.userName,
      password: this.password
    };

    // required fields
    if (!this.validateService.validateRegister(newUser) ) {
      this.flashMessage.show('Please fill in all field', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // required email
    if (!this.validateService.validateEmail(newUser.email) ) {
      this.flashMessage.show('Please use validate email', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // register user
    this.authService.registerUser(newUser).subscribe(data => {
      if (data.success) {
        this.flashMessage.show('You are registered, now please login', { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/register']);
      }
    });
  }

}
