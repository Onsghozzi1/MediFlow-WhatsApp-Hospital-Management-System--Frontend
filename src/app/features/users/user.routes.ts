import { Routes } from '@angular/router';
import { ListUsers } from './pages/list-users/list-users';
import { AddUser } from './pages/add-user/add-user';

export const user_ROUTES: Routes = [
   { path: 'users_list', component: ListUsers },
   { path: 'adduser', component: AddUser },
   { path: 'adduser/:id', component: AddUser }
];