import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserStore {

  // =========================
  // STATE
  // =========================
  private _user = signal<any>(this.loadFromStorage());
  user$ = this._user.asReadonly();

  // =========================
  // LOAD SAFE
  // =========================
  private loadFromStorage() {
    const data = localStorage.getItem('user');
     
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Invalid user in localStorage');
      localStorage.removeItem('user');
      return null;
    }
  }

  // =========================
  // SET USER
  // =========================
set(user: any) {

  if (!user?.access_token) return;

  this._user.set(user);
  localStorage.setItem("user", JSON.stringify(user));
}
  // =========================
  // CLEAR USER
  // =========================
  clear() {
    localStorage.removeItem('user');
  }

  // =========================
  // GET USER
  // =========================
  getUser() {
    return this._user();
  }

  // =========================
  // AUTH CHECK (IMPORTANT FIX)
  // =========================
  isAuthenticated(): boolean {
    const user = this._user();

    return !!(
      user &&
      user.access_token &&
      user.expires_at &&
      Date.now() < user.expires_at
    );
  }

  // =========================
  // COMPUTED VALUES (FIXED)
  // =========================
  userId = computed(() => this._user()?.id ?? null);

  firstName = computed(() => this._user()?.firstName ?? null);

  lastName = computed(() => this._user()?.lastName ?? null);

  email = computed(() => this._user()?.email ?? null);

  profilePic = computed(() => this._user()?.profilePic ?? null);

  roleTypes = computed(() => this._user()?.roleTypes ?? []);
}