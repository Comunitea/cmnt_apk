import { Component, Input, Output, EventEmitter } from '@angular/core';
/**
 * Generated class for the CardLogComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'card-log',
  templateUrl: 'card-log.html'
})
export class CardLogComponent {

  text: string;

  @Input() card: {}
  @Input() apk: {}
  @Output() notify: EventEmitter <Boolean> = new EventEmitter<Boolean>();

  constructor() {
   
  }

}
