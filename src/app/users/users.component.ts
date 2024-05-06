import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [UsersService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit , OnDestroy{
  users: any[] = [];
  searchedUser: any[] = [];
  searchItem: string = '';
  sortBy: string = '';
  isFiltered: boolean = false;
  isSorted: boolean = false;
  userSub!: Subscription;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.userSub = this.userService.getUsers().subscribe((users: any) => {
      this.users = users.users;
      this.searchedUser = [...this.users];
    });
  }

  sortData() {
    if (!this.sortBy) return;

    this.searchedUser.sort((a, b) => {
      const valA =
        typeof a[this.sortBy] === 'string' 
          ? a[this.sortBy].toLowerCase()
          : a[this.sortBy];
      const valB =
        typeof b[this.sortBy] === 'string'
          ? b[this.sortBy].toLowerCase()
          : b[this.sortBy];

      if(this.isSorted === true){
        if (valA < valB) {
          return -1;
        } else if (valA > valB) {
          return 1;
        } else {
          return 0;
        }
      }else{
        if (valA < valB) {
          return 1;
        } else if (valA > valB) {
          return -1;
        } else {
          return 0;
        }
      }
      
    });
  }

  filterData() {
    if (!this.searchItem.trim()) {
      this.isFiltered = false;
      this.searchedUser = [...this.users];
    } else {
      this.isFiltered = true;
      const searchText = this.searchItem.toLowerCase().trim();
      this.searchedUser = this.users.filter(
        (user) =>
          user.id.toString().includes(searchText) ||
          user.firstName.toLowerCase().includes(searchText) ||
          user.age.toString().includes(searchText) ||
          user.gender.toLowerCase().includes(searchText) ||
          user.email.toLowerCase().includes(searchText) ||
          user.phone.includes(searchText) ||
          user.height.toString().includes(searchText) ||
          user.weight.toString().includes(searchText)
      );
    }
    this.sortData();
  }
  sortByColumn(column: string) {
    if(this.sortBy != column){
      this.isSorted = false
    }
    this.sortBy = column;
    this.isSorted = !this.isSorted;
    this.sortData();
  }

  ngOnDestroy(): void {
   this.userSub.unsubscribe();   
  }
}
