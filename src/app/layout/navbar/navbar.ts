import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UiService } from '../../shared/ui-kit/ui.service';
import { UserStore } from '../../core/auth/user.store';
import { AuthService } from '../../core/services/auth/auth-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private userStore = inject(UserStore);
  private ui = inject(UiService);
  private authService = inject(AuthService);
  profilePic: string | undefined;
  user = this.userStore.user$;
  constructor(

  ) {

    // ✅ فقط effect للdebug أو side effect بسيط
    effect(() => {
      console.log('👤 user changed:', this.user())
        // 🖼️ Prepare profile picture for display
          const rawPhoto = this.user().profilePicture ?? '';
          this.profilePic = rawPhoto ? this.cleanBase64(rawPhoto) : '';
    
    });
  }
  /**
   * 🧼 Removes the Base64 image prefix (data:image/*;base64,)
   * to keep only the raw Base64 content.
   */
  cleanBase64(data: string): string {
    return data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  }
  toggleSideNav() {
    this.ui.toggleSidebar();
  }

  logout() {
    // this.userStore.clear();
    this.authService.logout();
  }
}