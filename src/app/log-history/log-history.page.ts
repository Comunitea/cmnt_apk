import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { AudioPlayer } from '../../providers/audio/audio';
import { OdooProvider } from '../../providers/odoo-connector/odoo-connector';
import { StorageService } from '../../providers/storage/storage';

@Component({
  selector: 'app-log-history',
  templateUrl: './log-history.page.html',
  styleUrls: ['./log-history.page.scss'],
})
export class LogHistoryPage implements OnInit {
  employee: any
  apk: any
  attendances: any
  constructor(private storage: StorageService, private audio: AudioPlayer, private odoo: OdooProvider, private router: Router) {
    this.storage.get('EMPLEADO').then((empleado) => {
      console.log("empleado => ", empleado);
      if (empleado){
        this.employee = empleado['employee']
        this.apk = empleado['apk']
        this.get_attendances()
      } else {
        this.audio.play('error');
        this.router.navigate(['/home']);
      } 
    });
  }

  presentAlert(titulo: string, texto: any) {
    const showAlert = async () => {
      await Dialog.alert({
        title: titulo,
        message: texto,
      });
    };
  }

  get_attendances(){
    let model = 'hr.attendance'
    let values = {'limit': 14, 'employee_id': this.employee['id']}
    
    this.odoo.execute(model, 'get_logs', values).then((atts)=>{
      console.log(atts)
      this.attendances = atts 
      this.audio.play('ok');
    })
    .catch(() => {
      this.audio.play('ok')
      this.presentAlert('Error!', 'No se pudo recuperar la lista de logs contra odoo');
    });
  
  }

  page_list() {
    this.router.navigate(['/page-list']);
  }

  inicio() {
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}
