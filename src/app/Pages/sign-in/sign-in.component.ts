import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ToasterService } from 'src/app/Services/ToasterService/toaster.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { UserPresence } from 'src/app/appModel/chat-model';
import { SharedService } from 'src/app/Services/Shared/shared.service';
import { NotificationMessagingService } from 'src/app/Services/NotificationMessage/notification-messaging.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement>;
  registerForm!: FormGroup;
  loginForm!: FormGroup;
  private storage = getStorage(initializeApp(environment));
  imagePreview: any;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private itemService: ItemsService,
    private sharedService: SharedService,
    private notificationMessageService: NotificationMessagingService
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
      ImageUrl: ['', Validators.required],
    },
      { validators: passwordMatchingValidatior })
  }


  async Login() {debugger
    await this.authService.SignIn(this.loginForm.value);
    this.sharedService.triggerLogin();
    let obj: UserPresence = {
      Status: 'Online',
      UserId: JSON.parse(localStorage.getItem('user')).uid,
      updatedBy: new Date()
    }
    this.itemService.setUserPresence(obj);
    let fcmToken = await this.notificationMessageService.requestPermission();
    this.notificationMessageService.listen();
    this.itemService.UpdateFcmToken(fcmToken);
    
  }

  async Register() {
    let imageUrl = await this.uploadImageAndGetURL(this.fileInput.nativeElement.files[0]);
    this.registerForm.value.ImageUrl = imageUrl;
    this.authService.SignUp(this.registerForm.value)
  }

  async uploadImageAndGetURL(file: File): Promise<string> {
    const filePath = `images/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    await uploadBytes(storageRef, file);

    return getDownloadURL(storageRef);
  }
}


export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('Password');
  const confirmPassword = control.get('ConfirmPassword');
  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};