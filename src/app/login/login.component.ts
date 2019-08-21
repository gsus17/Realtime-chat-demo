import { Component, OnInit, NgZone } from '@angular/core';
import { FirebaseAuthService } from './firebase-auth/firebase-auth.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { FirebaseDBService } from '../master/firebase-db/firebase-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private db: FirebaseDBService,
    private zone: NgZone,
    private router: Router) { }

  ngOnInit() {
  }

  /**
   * Login with google.
   */
  public googleLogin() {
    console.log(`${LoginComponent.name}::googleLogin`);

    this.firebaseAuthService.googleLogin()
      .then((res) => {
        console.log(`${LoginComponent.name}::success`, res);
        this.saveLocalUser(res);
        this.goToMaster();
      })
      .catch((err) => {
        console.log(`${LoginComponent.name}::catch`, err);
      });
  }

  /**
   * Login with twitter.
   */
  public twitterLogin() {
    console.log(`${LoginComponent.name}::twitterLogin`);
  }

  /**
   * Save user login.
   */
  private saveLocalUser(res: any) {
    console.log(`${LoginComponent.name}::saveLocalUser`);

    const user: User = {
      uid: res.user.uid,
      name: res.user.displayName,
      avatar: res.user.photoURL
    };

    this.firebaseAuthService.setUser(user);
    this.db.createUser(user);
  }

  /**
   * Redirect to master view.
   */
  private goToMaster() {
    console.log(`${LoginComponent.name}::goToMaster`);
    this.zone.run(() => this.router.navigate(['/master']));
  }
}
