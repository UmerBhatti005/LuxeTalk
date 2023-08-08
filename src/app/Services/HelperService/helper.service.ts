import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
var encryptor: any = '';//require('src/app/appCommon/Utilities/encryptor.js');
@Injectable({
    providedIn: 'root',
})
export class HelperService {
    key!: string;
    constructor(private sanitizer: DomSanitizer) {
        // this.key = environment.KEY;
    }
    sanitizeUrl(url: any) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    ecryption(text: any) {
        return encryptor.encryptData(text, this.key);
    }
    decryption(text: any) {
        if (text != null) {
            return encryptor.decryptData(text, this.key);
        } else {
            return false
        }
    }
}
