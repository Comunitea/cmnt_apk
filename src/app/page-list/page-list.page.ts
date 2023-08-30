import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { Geolocation } from '@capacitor/geolocation';
import { AudioPlayer } from '../../providers/audio/audio';
import { OdooProvider } from '../../providers/odoo-connector/odoo-connector';
import { StorageService } from '../../providers/storage/storage';


@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.page.html',
  styleUrls: ['./page-list.page.scss'],
})
export class PageListPage implements OnInit {
  EMPLOYEE_FIELDS = ['id', 'name', 'name_to_user_zone', 'user_id', 'state', 'last_sign', 'last_sign_hour']
  selectedItem: any;
  icons = [];
  attendances: any;
  employee: any;
  apk: any;
  action: string = '';
  date: string = '';
  gps: any;
  state: any;
  url_map: string = '';
  ip: string = '';
  show_gps_info: any;
  last_sign_hour: string = '';
  user: any;
  logs: string[] = [];
  company_config: any;
  loading_location: boolean = true;
  constructor(private storage: StorageService, private audio: AudioPlayer, private odoo: OdooProvider, private router: Router) {
    this.state = {'present': 'Presente', 'absent': 'Ausente'}
    this.gps = {}
    this.url_map = 'https://maps.google.com'
    this.show_gps_info = false
    this.get_init_data();
  }

  /* evaluo los datos de la conexión.*/
  async get_init_data(){
		await this.storage.get_conexion_data().then((conn: any)=>{
      this.user = conn.user_id;
      this.get_current_position();
		})
	}

  async get_current_position(){
    await Geolocation.getCurrentPosition().then((coordinates) => {
      console.log("coordinates => ", coordinates);

      this.audio.play('gps_ok');
      
      this.gps['latitude'] = coordinates.coords.latitude
      this.gps['longitude'] = coordinates.coords.longitude
      this.gps['accuracity'] = Math.round(coordinates.coords.accuracy)
      this.gps['ip'] = this.ip

      this.url_map = "https://maps.google.com/?ll=" + coordinates.coords.latitude + "," + coordinates.coords.longitude + ",&z=32"
      this.url_map = this.get_url_map()
    }).catch((error) => {
      console.log('Error getting location', error);
      this.audio.play('error');
      this.gps['latitude'] = 0
      this.gps['longitude'] = 0
      this.gps['accuracity'] = 0
      this.gps['ip'] = this.ip
    });

    this.loading_location = false;

    this.storage.get('EMPLEADO').then((empleado) => {
      console.log("empleado => ", empleado);
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
      console.log('Error getting employee', error);
      this.audio.play('error');
      this.router.navigate(['/home']);
    });

    this.date = (new Date()).toLocaleString('es-ES', { timeZone: 'UTC' })
    
  }

  alternate_show_gps_info(){
    this.show_gps_info = !this.show_gps_info
  }

  get_url_map(){
    let url_ = "https://maps.google.com/?ll=" + this.gps['latitude'] + "," + this.gps['longitude']+ ",&z=20"
    return url_
    
  }

  presentAlert(titulo: string, texto: any) {
    const showAlert = async () => {
      await Dialog.alert({
        title: titulo,
        message: texto,
      });
    };
  }

  refresh_employee(){
    let values ={'employee_info': true, 'employee_id': this.employee['id']}
    this.odoo.execute('hr.employee', 'get_employee_info', values).then((employee)=>{
      if (employee){
        this.employee = employee
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
    
    this.odoo.execute(model, 'attendance_action_change_apk', values).then((act_change: any)=>{
      if (act_change['error']) {
        this.audio.play('error');
        this.presentAlert('Error de validación', act_change['error_msg'])
      }
      else {
        this.audio.play('check_in');
        let dateTime = new Date();
        this.last_sign_hour = dateTime.toLocaleString('es-ES', { timeZone: 'UTC' });
        this.refresh_employee();
      }
    })
    .catch(() => {
      this.audio.play('error');
      this.presentAlert('Error!', 'No se pudo hacer log contra odoo');
    });
    
  }

  attendance_history() {
    this.router.navigate(['/log-history']);
  }

  inicio() {
    this.router.navigate(['/home']);
  }

  get_attendances(){
    let model = 'hr.attendance'
    let values = {'limit': 1, 'employee_id': this.employee['id']}
    
    this.odoo.execute(model, 'get_logs', values).then((atts)=>{
      console.log("atts => ", atts);
      this.attendances = atts;
    })
    .catch(() => {
      this.presentAlert('Error!', 'No se pudo recuperar la lista de logs contra odoo');
    });

  }

  itemTapped(event:any, item:any) {
    this.router.navigate(['/page-list']);
  }

  ngOnInit() {
    
  }

}
