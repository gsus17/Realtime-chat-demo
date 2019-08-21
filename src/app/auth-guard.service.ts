import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthService } from './login/firebase-auth/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private fAuth: FirebaseAuthService,
    private router: Router) { }

  public canActivate() {
    const isLogged: boolean = this.fAuth.isUserLogged();
    if (!isLogged) {
      this.router.navigate(['/login']);
    }
    return isLogged;
  }
}
