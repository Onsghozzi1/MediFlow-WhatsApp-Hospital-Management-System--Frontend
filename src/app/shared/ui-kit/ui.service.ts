import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {

  private _collapsed = signal(false);
  collapsed$ = this._collapsed.asReadonly();

  toggleSidebar() {
    this._collapsed.update(v => !v);
  }

  // navbar data
  private _navbarData = signal<any>(null);
  navbarData$ = this._navbarData.asReadonly();

  setNavbarData(data: any) {
    this._navbarData.set(data);
  }
}