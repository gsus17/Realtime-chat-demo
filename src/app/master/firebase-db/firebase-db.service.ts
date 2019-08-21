import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../../interfaces/message';
import { User } from 'src/app/interfaces/user';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  /**
   * Message unread reference.
   */
  private messageUnreadCount;

  /**
   * Message unread subscription reference
   */
  private messageUnreadSubscription: Subscription;

  constructor(public db: AngularFirestore) { }

  /**
   * Return the message list.
   */
  public getMessages$(uid: string) {
    console.log(`${FirebaseDBService.name}::getMessages`);
    return this.db
      .collection('messages')
      .doc(uid)
      .collection('chats', ref => ref.orderBy('date'))
      .valueChanges();
  }

  /**
   * Insert a new message.
   */
  public setMessage(uid: string, newMessage: Message): Promise<firebase.firestore.DocumentReference> {
    console.log(`${FirebaseDBService.name}::setMessage`);
    return this.db
      .collection('messages')
      .doc(uid)
      .collection('chats')
      .add(newMessage);
  }

  /**
   * Update message unread.
   */
  public updateMessageUnread(user: User) {
    console.log(`${FirebaseDBService.name}::updateMessageUnread`);
    user.messageUnread = this.messageUnreadCount + 1;
    this.db
      .doc(`users/${user.uid}`)
      .update(user);
  }

  /**
   * Insert a new contact.
   */
  public createUser(user: User): void {
    console.log(`${FirebaseDBService.name}::createUser`);
    this.db
      .doc(`users/${user.uid}`)
      .update(user)
      .then(() => {
        this.listenMessageUnread(user);
      })
      .catch(() => {
        this.db
          .doc(`users/${user.uid}`)
          .set(user);
      });
  }

  /**
   * Delete all info of specific user.
   */
  public deleteUserData(user: User): void {
    console.log(`${FirebaseDBService.name}::deleteUserData`);
    this.deleteUser(user);
    this.deleteConversation(user.uid);
    this.messageUnreadSubscription.unsubscribe();
  }

  /**
   * Delete a contact.
   */
  private deleteUser(user: User): void {
    console.log(`${FirebaseDBService.name}::deleteUser`);
    this.db.doc(`users/${user.uid}`)
      .delete();
  }

  /**
   * Delete a contact.
   */
  private deleteConversation(uid: string): void {
    console.log(`${FirebaseDBService.name}::deleteConversation`);
    const refBase = this.db.collection('messages').doc(uid);
    refBase.collection('chats')
      .get()
      .forEach((data) => {
        data.docs
          .forEach((x) => {
            this.db
              .collection('messages')
              .doc(uid)
              .collection('chats').doc(x.id).delete();
          });
      })
      .then(() => {
        this.db
          .collection('messages')
          .doc(uid).delete();
      });
  }

  /**
   * Init the message unread subscription.
   */
  private listenMessageUnread(user: User) {
    this.messageUnreadSubscription = this.db
      .collection('users')
      .doc(user.uid)
      .valueChanges()
      .subscribe((response: User) => this.messageUnreadCount = response.messageUnread);
  }
}
