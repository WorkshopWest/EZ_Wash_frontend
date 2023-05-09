import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrderTableDataSource, OrderTableItem } from './order-table-datasource';
import {OrderService} from "../order.service";

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css']
})
export class OrderTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<OrderTableItem>;
  dataSource: OrderTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'orderNumber', 'customer', 'orderWeight', 'collectionTime', 'orderStatus'];

  constructor(private orderService: OrderService) {
    this.dataSource = new OrderTableDataSource(this.orderService);
  }

  ngAfterViewInit(): void {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    //this.dataSource.getOrders();
    this.dataSource.loadOrders();
    console.log("Test");
  }
}
