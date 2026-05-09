import { Component, inject } from '@angular/core';
import { UiService } from '../../shared/ui-kit/ui.service';
import { AuthService } from '../../core/services/auth/auth-service';
import { RouterLink } from '@angular/router';
import { UserStoreService } from '../../core/services/user-store/user-store-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private ui = inject(UiService);
  private authService = inject(AuthService);
  private userStoreService = inject(UserStoreService);

  profilePic: string = '';

  user: any = null;

  constructor() {

    // initial load
    this.user = this.userStoreService.getUser();
    this.updateProfilePic();

    // optional: refresh on storage changes
    window.addEventListener('storage', () => {
      this.user = this.userStoreService.getUser();
      this.updateProfilePic();
    });

  }

  private updateProfilePic() {

    console.log('👤 user loaded:', this.user);

    if (!this.user) {
      this.profilePic = '';
      return;
    }

    const rawPhoto = this.user.profilePicture ?? '';

    this.profilePic = rawPhoto
      ? this.cleanBase64(rawPhoto)
      : '';
  }

  cleanBase64(data: string): string {
    return data.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  }

  toggleSideNav() {
    this.ui.toggleSidebar();
  }

  logout() {
    this.authService.logout();
  }
}