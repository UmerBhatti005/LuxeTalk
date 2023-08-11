import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ToasterService } from 'src/app/Services/ToasterService/toaster.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  registerForm!: FormGroup;
  loginForm!: FormGroup;
  // cloudinary: cloudinary.Cloudinary = new cloudinary.Cloudinary({ cloud_name: environment.cloudinary.cloudName });

  //cloudinaryUrl: string = this.cloudinary.url('https://res.cloudinary.com/dpcdpz5oo/image/upload/v1687359055/ckd2kdslt5combzf1dw4.jpg', { width: 300, crop: 'scale' });
  // uploadOptions: cloudinary. = {
  //   cloudName: environment.cloudinary.cloudName,
  //   uploadPreset: 'default', // You need to set up an upload preset in your Cloudinary account
  // };
  imagePreview: any;

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

  Login() {
    this.authService.SignIn(this.loginForm.value)
    this.messageService.add({
      key: 'save',
      severity: '',
      detail: `Please select at least one of the following.`
    });
  }

  Register() {
    this.authService.SignUp(this.registerForm.value)
  }

  handleFileInput(event: any): void {
    debugger
    if (event == null) return;
    const file = event.target.files[0];

    const storage = getStorage();
    // Create a reference to 'mountains.jpg'
    const mountainsRef = ref(storage);
    // Generate a unique filename for the uploaded file
    const uniqueFilename = `${Date.now()}_${file.name}`;
    // Create a reference to 'images/mountains.jpg'
    const fileRef = ref(mountainsRef, uniqueFilename);
    // const mountainImagesRef = ref(storage);

    // // While the file names are the same, the references point to different files
    // mountainsRef.name === mountainImagesRef.name;           // true
    // mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 

    uploadBytes(fileRef, file).then((snapshot) => {
      let imageUrl = getDownloadURL(fileRef);
      let a = snapshot.ref.fullPath;
      console.log('Uploaded a blob or file!', a);
    }).then(downloadURL => {
      console.log('Image uploaded and URL retrieved:', downloadURL);
    })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
    // const file = event.target.files[0];
    // const uploadOptions: cloudinary.Configuration.Options = {
    //   api_key: environment.cloudinary.apiKey,
    //   uploadPreset: 'default', // You need to set up an upload preset in your Cloudinary account
    //   api_secret: environment.cloudinary.ApiSecret,
    //   cloud_name: environment.cloudinary.cloudName,
    // };
    // this.cloudinary.uploadImage .uploader.upload(file, uploadOptions, (error, result) => {
    //   if (error) {
    //     console.error('Upload error:', error);
    //   } else {
    //     console.log('Upload result:', result);
    //     this.imagePreview = result.secure_url;
    //   }
    // });
  }
}


export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('Password');
  const confirmPassword = control.get('ConfirmPassword');
  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};