import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.minLength(8), Validators.required]],
    });
  }

  ngOnInit() {}
  ngOnDestroy() {}

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(this.form.value).subscribe((data) => {
        if (data) {
          this.router.navigateByUrl('/');
        }
      });
    }
  }
}
