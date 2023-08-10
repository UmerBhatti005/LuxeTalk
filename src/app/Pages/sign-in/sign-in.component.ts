import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ToasterService } from 'src/app/Services/ToasterService/toaster.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  registerForm!: FormGroup;
  loginForm!: FormGroup;
  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private toastrNotification: ToasterService,
    private messageService: MessageService
  ) {
  }
  ngOnInit(): void {
    this.createLoginForm();
    this.createregisterForm();
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      // Id: [""],
      // UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
    })
  }

  createregisterForm() {
    this.registerForm = this.fb.group({
      Id: [""],
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      ConfirmPassword: ['', Validators.required],
    },
      { validators: passwordMatchingValidatior })
  }

  Login(){
    this.authService.SignIn(this.loginForm.value)
    this.messageService.add({
      key: 'save',
      severity: '',
      detail: `Please select at least one of the following.`
    });
  }

  Register(){
    this.authService.SignUp(this.registerForm.value)
  }
}


export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('Password');
  const confirmPassword = control.get('ConfirmPassword');
  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};