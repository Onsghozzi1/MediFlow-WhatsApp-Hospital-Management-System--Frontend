import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProfileStore {

  private _profile = signal<any>(null);
  profile$ = this._profile.asReadonly();

  setProfile(data: any) {
    this._profile.set(data);
  }

  private _preview = signal<any>(null);
  preview$ = this._preview.asReadonly();

  setPreview(data: any) {
    this._preview.set(data);
  }

  clearPreview() {
    this._preview.set(null);
  }
}