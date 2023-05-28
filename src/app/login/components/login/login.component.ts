import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup

  constructor(
    private router: Router,
    private loginService: LoginService,
    private formBuilder: FormBuilder
    ){
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      })
    }

    onSubmit() {
      if(this.loginForm.invalid) {
        alert('Todos los campos son necesarios')
      }

      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.loginService.login(username, password).subscribe(
        (response) => {
          const token = response.access_token;
          this.loginService.saveToken(token);
          this.goToDashboard()
        },
        (error) => {
          console.error(error);
          alert(error)
        }
      )
    }

    

  goToDashboard() {
    this.router.navigate(['/dashboard'])
  }

}
