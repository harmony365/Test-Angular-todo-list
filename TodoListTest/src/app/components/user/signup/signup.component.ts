import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../../../shared/user'

//Puntos de mejora General
import { Observer } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(private api: UserService, private toastr: ToastrService, private router: Router) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit() {
  }

  onSubmit() {

    const mySignup: Observer<User> = {
      next: (value) => {
        // Lógica para manejar el próximo valor
        //console.log('Next:', value);
      
        this.toastr.success('User Added Successfully');
        this.signupForm.reset();
        this.router.navigateByUrl('/login');
      },
      error: (error) => {
        // Lógica para manejar el error
        console.error('Error:', error);
      },
      complete: () => {
        // Lógica para manejar la finalización
        //console.log('Complete');
      }
    };

    if (this.signupForm.valid) {
      //console.log(this.signupForm.value);
      this.api.signupUser(this.signupForm.value).subscribe(mySignup);
    }
  }
}
