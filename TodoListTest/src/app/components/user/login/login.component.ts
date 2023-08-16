import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

//Puntos de mejora General
import { Observer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private api: UserService, private toastr: ToastrService, private router: Router) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit() { }

  onSubmit() {

    const myLogin: Observer<any> = {
      next: (value) => {
        // Lógica para manejar el próximo valor
        //console.log('Next:', value);
        const user = value.find((loginUser: any) => {
          return loginUser.email === this.loginForm.value.email && loginUser.password === this.loginForm.value.password;
        })
        if (user) {
          localStorage.setItem("User",JSON.stringify(user));
          this.toastr.success('Usuario Logueado satisfactoriamente.');
          this.loginForm.reset();
          this.router.navigateByUrl('/todo');
        } else {
          this.toastr.success('Email or Password Invalido');
        }
        
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
    
    if (this.loginForm.valid) {
      this.api.LoginByEmail().subscribe(myLogin);
    }
  }
}
