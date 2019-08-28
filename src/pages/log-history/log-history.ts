import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo-connector/odoo-connector';
import { Storage} from '@ionic/storage';

import { HomePage } from '../home/home';
import { AudioPlayer } from '../../providers/audio/audio';
/**
 * Generated class for the LogHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@Component({
  selector: 'page-log-history',
  templateUrl: 'log-history.html',
})
export class LogHistoryPage {
  employee: {}
  apk: {}
  attendances
  user: any

  constructor(public player: AudioPlayer, public navCtrl: NavController, private odoo: OdooProvider, private storage: Storage, public alertCtrl: AlertController, public navParams: NavParams) {

    this.user =  this.navParams.data;
    this.storage.get('EMPLEADO').then((empleado) => {
      if (empleado){
        console.log("tenemos empleado por storage");
        this.employee = empleado['employee']
        this.apk = empleado['apk']
        this.storage.set('APK_IMAGE', this.apk['image'])
      } else if (this.user) {
        this.employee = this.user['employee']
        this.apk = this.user['apk']
      } 
      this.get_attendances();
    }).catch((error) => {
      console.log('Error getting ployee', error);
      this.player.play('error')
      this.navCtrl.setRoot(HomePage);
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogHistoryPage');
  }
  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
        title: titulo,
        subTitle: texto,
        buttons: ['Ok']
    });
    alert.present();
  }
  get_attendances(){
    let model = 'hr.attendance'
    let values = {'limit': 14, 'employee_id': this.employee['id']}
    
    this.odoo.execute(model, 'get_logs', values).then((atts)=>{
      this.attendances = atts 
      this.player.play('ok')
    })
    .catch(() => {
      this.player.play('error')
      this.presentAlert('Error!', 'No se pudo recuperar la lista de logs contra odoo');
    });

  }
}
