import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tattoo-icon-message',
  templateUrl: './icon-message.component.html',
  styleUrls: ['./icon-message.component.scss']
})
export class IconMessageComponent implements OnInit {
  @Input() icon: string; 
  @Input() message: string; 

  constructor() { }

  ngOnInit(): void {
  }

  get class(): string {
    return `pi pi-${this.icon}`;
  }
}
