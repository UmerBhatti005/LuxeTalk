import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, first, map } from 'rxjs';
import { UserPresence } from 'src/app/appModel/chat-model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  userId: string;

  constructor(private fireStore: AngularFirestore) {
    this.userId = JSON.parse(localStorage.getItem('user'))?.uid;
  }

  firebaseTable: string = '';

  GetItemsWithPagination(take: any, skip: any) {
    const queryFn: QueryFn = ref => ref
      .orderBy("updatedBy", 'desc')
    // .startAfter(skip)
    // .limit(take);
    return this.fireStore.collection(this.firebaseTable, queryFn).snapshotChanges();
  }

  GetItems() {
    return this.fireStore.collection(this.firebaseTable, ref => ref.orderBy('updatedBy', 'asc')).snapshotChanges();
  }


  GetchatofTwoPeople(obj: { loggedInUser: string, openChatPerson: string }, take: number, skip: any): Observable<any[]> {
    return this.fireStore.collection(this.firebaseTable, ref => {
      return ref
        .where('UserId', 'in', [obj.loggedInUser, obj.openChatPerson])
        .where('SendToUser', 'in', [obj.loggedInUser, obj.openChatPerson])
        .orderBy('updatedBy', 'desc')
        //.startAfter(skip)
        .limit(take)
    }).snapshotChanges();
  }

  GetItemById(id: any) {
    return this.fireStore.collection(this.firebaseTable).doc(id).snapshotChanges();
  }

  CreateItem(student: any) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.firebaseTable).add(student).then((reponse: any) => {
      }, error => {
        console.log(error);
      })
    })
  }

  UpdateMsgs(obj: any, id) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.firebaseTable).doc(id).update(obj).then((reponse: any) => {
      }, error => {
        console.log(error);

      })
    })
  }

  async updateColumnInMultipleDocuments(documentIds: string[]): Promise<void> {
    const batch = this.fireStore.firestore.batch();

    documentIds.forEach((docId) => {
      const docRef = this.fireStore.collection(this.firebaseTable).doc(docId).ref;
      batch.update(docRef, { ['msgRead']: true });
    });
    try {
      await batch.commit();
    } catch (error) {
      console.error('Error updating documents:', error);
    }
  }

  GetUnReadMsgs(): Observable<any[]> {
    return this.fireStore.collection('chatMsg', ref => ref.where('SendToUser', '==', this.userId)).valueChanges().pipe(
      map((documents: any[]) => documents.map(document => ({
        UserId: document['UserId'],
        msgRead: document['msgRead']
      })))
    );
  }

  UpdateItem(student: any, id) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.firebaseTable).doc(id).update(student).then((reponse: any) => {
      })
    })
  }

  DeleteItem(id: any) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection(this.firebaseTable).doc(id).delete().then((reponse: any) => {
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

  setUserPresence(obj: UserPresence) {//}: Promise<any> {debugger
    let AvailabilityStatusId = localStorage.getItem('AvailabilityStatusId')

    if (AvailabilityStatusId == null) {
      this.fireStore.collection('userPresence').add(obj);
    }
    else {
      this.fireStore.collection('userPresence').doc(AvailabilityStatusId).update(obj);
    }
    //     }
    //     resolve('');
    //   });
    // })
  }

  GetAllUserPresence() {
    return this.fireStore.collection('userPresence').valueChanges();
  }
  GetUserPresence(id: any) {
    return this.fireStore.collection('userPresence', ref => ref.where('UserId', '==', id)).snapshotChanges();
  }

  setTypingStatus(obj: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.GetTypingStatus(obj.UserId).subscribe((res: any) => {
        let docId = res[0]?.payload?.doc?.id
        if (res.length == 0) {
          this.fireStore.collection('typingStatus').add(obj);
        }
        else {
          this.fireStore.collection('typingStatus').doc(docId).update(obj);
        }
        resolve('');
      });
    })
  }

  GetTypingStatus(id: any) {
    return this.fireStore.collection('typingStatus', ref => ref.where('UserId', '==', id)).snapshotChanges();
  }

  GetAllTypingStatus() {
    return this.fireStore.collection('typingStatus').valueChanges();
  }
}
