import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser'
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

  constructor(private iab: InAppBrowser) {
  }

  open_map_url(url:string){
    console.log(url);
    const browser = this.iab.create(url, '_system', 'location=yes');
  }

}
