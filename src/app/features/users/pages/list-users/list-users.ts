import { Component, ViewEncapsulation } from '@angular/core';
import { User_filter, userList } from '../../../../core/models/user.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagement } from '../../services/user-management';
import { AuthService } from '../../../../core/services/auth/auth-service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-users',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule
  ],
  templateUrl: './list-users.html',
  styleUrl: './list-users.css',
    encapsulation: ViewEncapsulation.None
})
export class ListUsers {
  filter: User_filter = {
    idUser: 0,
    name: '',
    email: ''
  };
  fullNameControle = new FormControl();
  emailControle = new FormControl();

  pageIndex = 0;
  pageSizeOptions = [1, 25, 50];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  ListUser: userList = {
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  };

  constructor(
    private userPanelManagementService: UserManagement,
    private authservice: AuthService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userPanelManagementService.GetUserList(
      this.ListUser.pageNo,
      this.ListUser.pageSize,
      this.filter
    ).subscribe((data: any) => {
      console.log("DATAA "+JSON.stringify(data))
      this.ListUser = {
        content: data.content,
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data?.totalElements,
        totalPages: data?.totalPages,
        last: data.last
      };
    });
  }

  handlePageEvent(e: PageEvent): void {
    this.ListUser.pageNo = e.pageIndex;
    this.ListUser.pageSize = e.pageSize;
    this.loadUsers();
  }



  deleteUser(user: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete ${user.user.username || 'the user'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userPanelManagementService.deleteUserById(user.user.idUser, true).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
            this.loadUsers();
          },
          error: () => Swal.fire('Error!', 'Failed to delete the user.', 'error')
        });
      }
    });
  }



  /**
   * Handles user role changes with confirmation dialog
   */

  onChangeRole(user: any, event: Event): void {
    // Get selected role from dropdown
    const selectedValue = (event.target as HTMLSelectElement).value;

    // Store old role in case of rollback
    const previousRole = user.roleType;

    // Show confirmation dialog before changing role
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to change the role to ${selectedValue}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel',

    }).then((result) => {
      // If user confirms the change
      if (result.isConfirmed) {
        // Update UI immediately (optimistic update)
        user.roleType = selectedValue;

        // Call API to update role on server
        this.userPanelManagementService.changeRoles(user.id, selectedValue).subscribe({
          next: (user) => {
            // Show success message
            Swal.fire('Success!', `User role changed to ${selectedValue}.`, 'success');

            // Update localStorage with new user data
            localStorage.setItem('user', JSON.stringify(user));
          },
          error: () => {
            // Rollback to previous role on error
            user.roleType = previousRole;
            (event.target as HTMLSelectElement).value = previousRole;

            // Show error message
            Swal.fire('Error!', 'Failed to update user role.', 'error');
          }
        });
      } else {
        // If user cancels, reset dropdown to previous value
        (event.target as HTMLSelectElement).value = previousRole;
      }
    });
  }


  /**
   * Handles user account status changes (Validated/Pending)
   */

  onStatusChange(user: any, event: Event): void {
    // Convert string 'true'/'false' to boolean
    const selectedValue = (event.target as HTMLSelectElement).value === 'true';

    // Store current status for rollback
    const previousStatus = user.isValidated;

    // Show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to mark this user as ${selectedValue ? 'Validated' : 'Pending'}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel',
    
    }).then((result) => {
      // If user confirms
      if (result.isConfirmed) {
        // Update UI immediately
        user.isValidated = selectedValue;

        // Call API to update status
        this.userPanelManagementService.changeAccountStatus(user.id, selectedValue).subscribe({
          next: () => {
            // Show success
            Swal.fire('Success!', `User status changed to ${selectedValue ? 'Validated' : 'Pending'}.`, 'success');
          },
          error: () => {
            // Rollback on error
            user.isValidated = previousStatus;
            (event.target as HTMLSelectElement).value = previousStatus.toString();
            Swal.fire('Error!', 'Failed to update user status.', 'error');
          }
        });
      } else {
        // Reset dropdown if cancelled
        (event.target as HTMLSelectElement).value = previousStatus.toString();
      }
    });
  }



  // Counts how many users are activated (isValidated = true)
  get validatedCount(): number {
    return this.ListUser.content.filter((user: { isValidated: Boolean; }) => user.isValidated).length || 0;
  }

  // Counts how many users are pending (isValidated = false)
  get UnvalidatedCount(): number {
    return this.ListUser.content.filter((user: { isValidated: Boolean; }) => user.isValidated == false).length || 0;
  }

  // Apply filters to user list

 

  // Navigate to the register user page
  registerRouter() {
    this.router.navigate(["users/adduser"])
  }
  // Navigate to the register user page for editing a specific user
  edit_user(userId: Number) {
    this.router.navigate(['users/adduser', userId ]);
  }
remove_user(id:any){

  
}
}
