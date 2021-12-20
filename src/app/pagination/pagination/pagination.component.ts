import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() totalPages: number = 0;
  page: number = 1;
  @Output() pageEvent = new EventEmitter<number>();
  limit: number = 5;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Change pagination as next or previous page
   * @param type: ['prev', 'next']
   */
  prevNextPage(type: string) {
    switch (type) {
      case 'next':
        this.page += this.page < this.totalPages ? 1 : 0;
        break;
      case 'prev':
        this.page -= this.page > 1 ? 1 : 0;
    }
    this.pageEvent.emit(this.page);
  }

  /**
   * Change pagination by page number
   * @param index: number
   */
  changePaginationByNumber(index: number) {
    this.page = index;
    this.pageEvent.emit(this.page);
  }
}
