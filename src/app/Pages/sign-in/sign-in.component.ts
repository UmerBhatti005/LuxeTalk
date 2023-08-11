import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/Services/Auth/auth.service';
import { ToasterService } from 'src/app/Services/ToasterService/toaster.service';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

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
      ImageUrl: ['', Validators.required],
    },
      { validators: passwordMatchingValidatior })
  }

  Login() {
    this.authService.SignIn(this.loginForm.value)
  }

  async Register() {
    let imageUrl =  await this.uploadImageAndGetURL(this.fileInput.nativeElement.files[0]);
    this.registerForm.value.ImageUrl = imageUrl;
    this.authService.SignUp(this.registerForm.value)
  }

  async uploadImageAndGetURL(file: File): Promise<string> {
    const filePath = `images/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);

    await uploadBytes(storageRef, file);

    return getDownloadURL(storageRef);
  }

  // saveImageURLToFirestore(url: string): Promise<void> {
  //   return this.firestore.collection('images').add({ imageUrl: url });
  // }

  // handleFileInput(event: any): void {
  //   if (event == null) return;
  //   const file = event.target.files[0];

  //   const storage = getStorage();
  //   // Create a reference to 'mountains.jpg'
  //   const storageRef  = ref(storage);
  //   // Generate a unique filename for the uploaded file
  //   const uniqueFilename = `${Date.now()}_${file.name}`;
  //   // Create a reference to 'images/mountains.jpg'
  //   const fileRef = ref(storageRef, uniqueFilename);
  //   // const mountainImagesRef = ref(storage);

  //   // // While the file names are the same, the references point to different files
  //   // storageRef.name === mountainImagesRef.name;           // true
  //   // storageRef.fullPath === mountainImagesRef.fullPath;   // false 

  //   uploadBytes(fileRef, file).then((snapshot) => {
  //     let imageUrl = getDownloadURL(fileRef);
  //     let a = snapshot.ref.fullPath;
  //     console.log('Uploaded a blob or file!', a);
  //   }).then(downloadURL => {
  //     console.log('Image uploaded and URL retrieved:', downloadURL);
  //   })
  //     .catch(error => {
  //       console.error('Error uploading file:', error);
  //     });
  //   // const file = event.target.files[0];
  //   // const uploadOptions: cloudinary.Configuration.Options = {
  //   //   api_key: environment.cloudinary.apiKey,
  //   //   uploadPreset: 'default', // You need to set up an upload preset in your Cloudinary account
  //   //   api_secret: environment.cloudinary.ApiSecret,
  //   //   cloud_name: environment.cloudinary.cloudName,
  //   // };
  //   // this.cloudinary.uploadImage .uploader.upload(file, uploadOptions, (error, result) => {
  //   //   if (error) {
  //   //     console.error('Upload error:', error);
  //   //   } else {
  //   //     console.log('Upload result:', result);
  //   //     this.imagePreview = result.secure_url;
  //   //   }
  //   // });
  // }

  // async handleFileInput(event: any): Promise<void> {
  //   if (event != null) {
  //     try {
  //       const file = event.target.files[0];
  //       const url = await this.uploadImageAndGetURL(file);
  //       // await this.saveImageURLToFirestore(url);
  //       console.log('Image uploaded and URL saved to Firestore.', url);
  //     } catch (error) {
  //       console.error('Error uploading image:', error);
  //     }
  //   }
  // }
}


export const passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('Password');
  const confirmPassword = control.get('ConfirmPassword');
  return password?.value === confirmPassword?.value ? null : { notmatched: true };
};