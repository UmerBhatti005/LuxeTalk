import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/Services/Items/items.service';
import { FormBuilder, FormGroup } from "@angular/forms";
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  students: any;
  showPageBool: boolean = false;
  studentForm: FormGroup;
  updateSection: boolean = false;
  updateStudentId: any;

  constructor(private itemService: ItemsService,
    public formBuilder: FormBuilder) {

  }

  createForm() {
    this.studentForm = this.formBuilder.group({
      name: [''],
      email: [''],
      course: [''],
      fees: [''],
      updatedBy: [new Date().toLocaleString()]
    })
  }

  ngOnInit(): void {
    this.itemService.firebaseTable = 'items';
    this.createForm();
    this.itemService.GetItems().subscribe(
      (res: any) => {
        this.students = res.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          }
        });
      }
    )
  }

  onSubmit() {
    debugger
    if (this.updateSection == true) {
      this.studentForm.value.updatedBy = new Date().toLocaleString()
      this.itemService.UpdateItem(this.studentForm.value, this.updateStudentId);
    }
    else {
      this.itemService.CreateItem(this.studentForm.value);
    }
    this.showPageBool = false;
  }

  editStudent(id) {
    debugger
    this.showPageBool = true;
    this.updateSection = true;
    this.itemService.GetItemById(id).subscribe(
      (data: any) => {
        this.updateStudentId = id;
        this.studentForm.patchValue(data.payload.data())
      }
    )
  }

  deleteStudent(id) {
    this.itemService.DeleteItem(id);
  }
}
