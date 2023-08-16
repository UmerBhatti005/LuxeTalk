import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable({
    providedIn: 'root'
})
export class ToasterService {
    constructor(private messageService: MessageService) {
    }
    logedInSuccessfully() {
        this.messageService.add({ key: 'save', severity: 'success', summary: 'Logged In Successfully', detail: JSON.parse(localStorage.getItem('user')).email });
    }
    customSuccess(msg: any) {
        this.messageService.add({ severity: 'success', summary: msg });
    }
    itemAdded() {
        this.messageService.add({ severity: 'success', summary: 'Item Added Successfully' });
    }
    itemUpdated() {
        this.messageService.add({ severity: 'success', summary: 'Item Updated Successfully' });
    }
    itemDeleted() {
        this.messageService.add({ severity: 'success', summary: 'Item Deleted Successfully' });
    }
    userNotFound() {
        this.messageService.add({ severity: 'error', summary: 'User Not Found' });
    }
    err() {
        this.messageService.add({ severity: 'error', summary: 'Something Bad Happened' });
    }
    customErr(msg: any) {
        this.messageService.add({ severity: 'error', summary: msg });
    }
    message(msg: any) {
        this.messageService.add({ key: 'save', severity: 'success', summary: msg })
    }
    emptyField(msg: any) {
        this.messageService.add({ severity: 'error', summary: msg })
    }
    DataAdded() {
        this.messageService.add({ severity: 'success', summary: 'Data added successfully' });
    }
}
