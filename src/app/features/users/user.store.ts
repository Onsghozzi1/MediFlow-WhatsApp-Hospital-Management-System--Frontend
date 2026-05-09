import { Injectable, signal } from "@angular/core";
import { User_filter, userList } from "../../core/models/user.model";
import { UserManagement } from "./services/user-management";

@Injectable({ providedIn: 'root' })
export class UserStore {

  private _users = signal<userList>({
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true
  });

  users$ = this._users.asReadonly();

  private _filter = signal<User_filter>({
    idUser: 0,
   
  });

  constructor(private service: UserManagement) {}

  load() {
    const f = this._filter();

    this.service.GetUserList(
      this._users().pageNo,
      this._users().pageSize,
      f
    ).subscribe((data: any) => {
      this._users.set(data);
    });
  }

  setPage(pageNo: number, pageSize: number) {
    this._users.update(u => ({ ...u, pageNo, pageSize }));
    this.load();
  }

  setFilter(filter: Partial<User_filter>) {
    this._filter.update(f => ({ ...f, ...filter }));
    this.load();
  }

  delete(id: number) {
    return this.service.deleteUserById(id, true);
  }
}