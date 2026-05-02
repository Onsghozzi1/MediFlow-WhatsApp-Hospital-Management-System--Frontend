import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserStore {

  private _user = signal<any>(this.load());
  user$ = this._user.asReadonly();

  private load() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  set(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this._user.set(user);
  }

  clear() {
    localStorage.removeItem('user');
    this._user.set(null);
  }

  // derived
  userId$ = signal(() => this._user()?.id || null);
  firstName$ = signal(() => this._user()?.firstName || null);
  lastName$ = signal(() => this._user()?.lastName || null);
  profilePic$ = signal(() => this._user()?.profilePic || null);
}