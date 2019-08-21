import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Message } from '../../interfaces/message';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

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
  public setMessage(uid: string, newMessage: Message): Promise<void> {
    console.log(`${FirebaseDBService.name}::setMessage`);
    return this.db
      .collection('messages')
      .doc(uid)
      .collection('chats')
      .doc(newMessage.uid)
      .set(newMessage);
  }

  /**
   * Insert a new contact.
   */
  public createUser(user: User): void {
    console.log(`${FirebaseDBService.name}::createUser`);
    this.db
      .doc(`users/${user.uid}`)
      .update(user)
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
    this.db
      .collection('messages')
      .doc(uid)
      .collection('chats')
      .doc(uid)
      .delete();
  }
}
