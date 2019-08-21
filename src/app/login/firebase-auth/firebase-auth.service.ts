import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private currentUser: User = null;

  constructor(private afAuth: AngularFireAuth) { }

  /**
   * Login with Google.
   */
  public googleLogin() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  /**
   * Return the current state of login.
   */
  public isUserLogged(): boolean {
    const currenUser = this.afAuth.auth.currentUser;
    const response = currenUser ? true : false;
    return response;
  }

  /**
   * Logout.
   */
  public logout() {
    return this.afAuth.auth.signOut();
  }

  /**
   * Save the current user.
   */
  public setUser(user: User) {
    this.currentUser = user;
  }

  /**
   * Return the current user.
   */
  public geUser() {
    return this.currentUser;
  }
}
