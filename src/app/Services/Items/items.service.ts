import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private fireStore: AngularFirestore) { }

  firebaseTable: string = '';

  GetItemsWithPagination(req: any) {
    debugger
    // this.rows * this.pageNumber - this.rows
    const queryFn: QueryFn = ref => ref
      .orderBy("email")
      .startAfter(req._pageIndex)
      .limit(req._pageSize);
    // req._pageSize = req._pageIndex;
    // this.pageNumber = req._pageIndex / req._pageSize + 1;
    return this.fireStore.collection(this.firebaseTable, queryFn).snapshotChanges();
    // return this.fireStore.collection(this.firebaseTable, ref => ref.orderBy('updatedBy', 'desc')).snapshotChanges();
  }

  GetItems() {
    // return this.fireStore.collection(this.firebaseTable).snapshotChanges();
    return this.fireStore.collection(this.firebaseTable, ref => ref.orderBy('updatedBy', 'asc')).snapshotChanges();
  }

  GetItemById(id) {
    return this.fireStore.collection(this.firebaseTable).doc(id).snapshotChanges();
  }

  CreateItem(student: any) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.firebaseTable).add(student).then((reponse: any) => {
        console.log(reponse);
      }, error => {
        console.log(error);
      })
    })
  }

  UpdateItem(student: any, id) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.firebaseTable).doc(id).update(student).then((reponse: any) => {
        console.log(reponse);
      }, error => {
        console.log(error);

      })
    })
  }

  DeleteItem(id: any) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.firebaseTable).doc(id).delete().then((reponse: any) => {
        console.log(reponse);
      }, error => {
        console.log(error);

      })
    })
  }

  getTotalRecordCount(): Observable<number> {
    return this.fireStore.collection(this.firebaseTable).get()
      .pipe(
        map(
          snapshot =>
            snapshot.size
        ));
  }
}
