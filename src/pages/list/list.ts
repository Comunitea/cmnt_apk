import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo-connector/odoo-connector';
import { Storage} from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents
} from '@ionic-native/background-geolocation';
import { AudioPlayer } from '../../providers/audio/audio';
//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import {HomePage} from '../home/home'


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  EMPLOYEE_FIELDS = ['id', 'name', 'name_to_user_zone', 'user_id', 'state', 'last_sign', 'last_sign_hour']
  selectedItem: any;
  icons: string[];
  attendances
  employee:{}
  apk:{}
  action: string;
  date: string
  gps:{}
  state: {}
  url_map: string
  ip: string
  show_gps_info
  last_sign_hour: string
  user: any
  logs: string[] = [];
  company_config: any

  constructor(public player: AudioPlayer, public navCtrl: NavController, private odoo: OdooProvider, private storage: Storage,
    public alertCtrl: AlertController, public navParams: NavParams, private geolocation: Geolocation, private backgroundGeolocation: BackgroundGeolocation) {
    // If we navigated to this page, we will have an item available as a nav param
    this.state = {'present': 'Presente', 'absent': 'Ausente'}
    this.gps = {}
    this.url_map = 'https://maps.google.com'
    this.show_gps_info = false
    this.user =  this.navParams.data

    console.log(this.user);
  
    
    this.geolocation.getCurrentPosition().then((resp) => {
      this.player.play('gps_ok')
      this.gps['latitude'] = resp.coords.latitude
      this.gps['longitude'] = resp.coords.longitude
      this.gps['accuracity'] = Math.round(resp.coords.accuracy)
      this.gps['ip'] = this.ip

      this.url_map = "https://maps.google.com/?ll=" + resp.coords.latitude + "," + resp.coords.longitude + ",&z=32"
      this.url_map = this.get_url_map(this.gps)
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    
    this.storage.get('EMPLEADO').then((empleado) => {
      if (empleado){
        console.log("tenemos empleado por storage");
        this.employee = empleado['employee']
        this.apk = empleado['apk']
        this.storage.set('APK_IMAGE', this.apk['image'])
        this.refresh_employee();
      } else if (this.user) {
        this.employee = this.user['employee']
        this.apk = this.user['apk']
        this.refresh_employee();
      } 
    }).catch((error) => {
      console.log('Error getting ployee', error);
      this.player.play('error')
      this.navCtrl.setRoot(HomePage);
    });

    this.date = (new Date()).toLocaleString('es-ES', { timeZone: 'UTC' })   
  }  

  alternate_show_gps_info(){
    this.show_gps_info = !this.show_gps_info
  }

  get_url_map(gps){
    let url_ = "https://maps.google.com/?ll=" + gps['latitude'] + "," + gps['longitude']+ ",&z=20"

    //let url_ = "https://www.openstreetmap.org/#map=19/" + gps['latitude'] + "/" + gps['longitude'] + "&layers=TN"
    return url_
    
  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
        title: titulo,
        subTitle: texto,
        buttons: ['Ok']
    });
    alert.present();
  }

  refresh_employee(){
    let values ={'employee_info': true, 'employee_id': this.employee['id']}
    this.odoo.execute('hr.employee', 'get_employee_info', values).then((employee)=>{
      if (employee){
        this.employee = employee
        if (this.employee['state'] == 'present') {
          this.startBackgroundGeolocation();
        } else {
          this.stopBackgroundGeolocation();
        }
      }
    })
    .catch((error) => {
      console.log(error);
      this.presentAlert('Error!', 'No se pudo recargar el empleado');
    });
  }

  check_log(){
    let model = 'hr.employee'
    let values ={'limit': 1, 'employee_id': this.employee['id'], 'gps_info': this.gps}
    
    this.odoo.execute(model, 'attendance_action_change_apk', values).then((act_change)=>{
      console.log(act_change)
      if (act_change['error']) {
        this.player.play('error')
        this.presentAlert('Error de validación', act_change['error_msg'])
      }
      else {
        //this.get_attendances()
        this.player.play('check_in')
        this.refresh_employee()
        //this.presentAlert('Log', 'Log correcto')
      }
    })
    .catch(() => {
      this.player.play('error')
      this.presentAlert('Error!', 'No se pudo hacer log contra odoo');
    });
    
  }

  get_attendances(){
    let model = 'hr.attendance'
    let values = {'limit': 1, 'employee_id': this.employee['id']}
    
    this.odoo.execute(model, 'get_logs', values).then((atts)=>{
      console.log(atts)
      this.attendances = atts 
    })
    .catch(() => {
      this.presentAlert('Error!', 'No se pudo recuperar la lista de logs contra odoo');
    });

  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }

  // background geolocation
  startBackgroundGeolocation() {
    this.company_config = [];
    let values = {'user_id': this.employee['id']}
    this.odoo.execute('clock.company.apk', 'get_company_apk_config', values).then((atts)=>{
      this.company_config = atts

      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: this.company_config['min_accuracity'] || 10,
        stationaryRadius: this.company_config['stationary_radius'] || 50,
        distanceFilter: this.company_config['distance_filter'] || 500,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        interval: this.company_config['min_minute']*60 || 60000
      };
  
      this.backgroundGeolocation.configure(config).then(() => {
        this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
            this.sendGPS(location);
          });
      });
      // start recording location
      this.backgroundGeolocation.start();
    })
    .catch(() => {
      this.presentAlert('Error!', 'No se pudo recuperar la lista de logs contra odoo');
    });

  }

  sendGPS(location) {
    if (location.speed == undefined) {
      location.speed = 0;
    }      

    let values ={'employee_id': this.employee['id'], 'latitude': this.gps['latitude'] || location.latitude, 'longitude': this.gps['longitude'] || location.longitude}
    this.odoo.execute('hr.attendance.position', 'insert_position_apk', values)
      .then(data => {
        console.log("POST Request is successful ", data);
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
        // BackgroundGeolocation.endTask(taskKey);
      })
      .catch(error => {
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
        console.log(error);
      });
  }

  stopBackgroundGeolocation(){
    this.backgroundGeolocation.stop();
  }  
  
}
