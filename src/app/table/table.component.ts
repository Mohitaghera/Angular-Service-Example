import { Component, OnInit } from '@angular/core';
import { ApiCallService } from '../api-call.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [ApiCallService],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent implements OnInit {
  users: any[] = [];
  searchedUser: any[] = [];
  searchItem: string = '';
  sortBy: string = '';
  isFiltered: boolean = false;

  constructor(private apiCallService: ApiCallService) {}

  ngOnInit() {
    this.apiCallService.getUsers().subscribe((users: any) => {
      this.users = users.users;
      this.searchedUser = [...this.users];
      // console.log(this.users);
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

      if (valA < valB) {
        return -1;
      } else if (valA > valB) {
        return 1;
      } else {
        return 0;
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
    this.sortBy = column;
    this.sortData();
  }
}
