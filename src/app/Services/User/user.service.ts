import { Injectable, OnInit } from '@angular/core';
import { ItemsService } from '../Items/items.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  constructor(private itemService: ItemsService) { }

  ngOnInit(): void {
  }


}
