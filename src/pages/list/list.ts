import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { OdooProvider } from '../../providers/odoo-connector/odoo-connector';
import { Storage} from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { AudioPlayer } from '../../providers/audio/audio';
//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import {HomePage} from '../home/home'
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';


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
  map: GoogleMap

  constructor(public player: AudioPlayer, public navCtrl: NavController, private odoo: OdooProvider, private storage: Storage,
    public alertCtrl: AlertController, public navParams: NavParams, private geolocation: Geolocation) {
    // If we navigated to this page, we will have an item available as a nav param
    this.state = {'present': 'Presente', 'absent': 'Ausente'}
    this.gps = {}
    this.url_map = 'https://maps.google.com'
    this.show_gps_info = false

      
  
    
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
    
    let user =  this.navParams.data;
    if (!user['employee'])
      {this.storage.get('EMPLEADO').then((empleado) => {
        if (empleado){
          this.employee = empleado['employee']
          this.apk = empleado['apk']
          this.storage.set('APK_IMAGE', this.apk['image'])
          this.refresh_employee(this.employee['id'])
        }
        else{
           this.navCtrl.setRoot(HomePage);
           this.player.play('error')
        }
      })
      }
    else {
      this.employee = user['employee']
      this.apk = user['apk']
      this.refresh_employee(this.employee['id'])
    }



    console.log(this.employee)
    //this.get_attendances()
    // Let's populate this page with some filler content for funzies
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
  open_url(){
    this.player.play('click')
    this.geolocation.getCurrentPosition().then((position) => {

//      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


      let mapOptions = {
        camera: {target : {lat: position.coords.latitude,
                           lng: position.coords.longitude}},
        zoom: 20,
        other_params:"key=AIzaSyBxTb9LsrCPdG3s_OwH3g_nnn_LitbuD5Y"
      }
      
      this.map = GoogleMaps.create('map_canvas', mapOptions);

      this.map.addMarker({
        title: 'Mi posición',
        icon: 'blue',
        animation: 'DROP',
        position: mapOptions.camera.target
      })
      
    })
  }

  presentAlert(titulo, texto) {
    const alert = this.alertCtrl.create({
        title: titulo,
        subTitle: texto,
        buttons: ['Ok']
    });
    alert.present();
  }


  refresh_employee(employee_id){
    let model = 'hr.employee'
    let values ={'employee_info': true, 'employee_id': this.employee['id']}
    this.odoo.execute('hr.employee', 'get_employee_info', values).then((employee)=>{
      if (employee){
        this.employee = employee
        console.log(employee)
      }
    })
    .catch(() => {
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
        this.refresh_employee(this.employee['id'])
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
}
