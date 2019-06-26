import {NavController, Platform, NavParams, AlertController} from 'ionic-angular';
import {Component} from '@angular/core';

import { Storage} from '@ionic/storage';
import { OdooProvider } from '../../providers/odoo-connector/odoo-connector';
import { ListPage } from '../list/list';
import { AudioPlayer } from '../../providers/audio/audio';

import { File } from '@ionic-native/file';
import { ReturnStatement } from '@angular/compiler';
declare var odoo_cfg: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
    EMPLOYEE_FIELDS = ['id', 'name', 'user_id', 'state', 'last_sign']
		loginData = {password: '', username: ''};
		
		conexion_data = {
			url: '',
			port: '',
			db: ''
		}
		
		conexion_user = {
			username: '',
			password: '',
			user: {},
			user_id: ''
		}
		s_conn = {
			url: '',
			port: '',
			db: '',
			username: '',
			password: '',
			user: {},
			user_id: ''
		}
	
	login
	employee:{}
	apk:{}
  cargar = false;
	mensaje = '';
	login_server = false
	apk_image
	has_conf: boolean=false
		constructor(public explorer: File, public plt: Platform,
								public player: AudioPlayer, public navCtrl: NavController, public navParams: NavParams,
                private storage: Storage, public alertCtrl: AlertController,
                private odoo: OdooProvider) {

									this.create_apk_dir()
									this.get_conexion_data()
									if (this.navParams.get('login')){
										this.login = this.navParams.get('login');
										}
									else {
										this.login = 0
									}
									//Reviso imagen de la compañia	
									this.storage.get('APK_IMAGE').then((image) => {
										if (image){
											this.apk_image = image}
										else
										{this.apk_image = false}
									})
								}



	get_conexion_data(){
		//evaluo los datos de la conexión.
		let conf = new odoo_cfg()
		let file_conn = conf.conexion()
		this.has_conf = false
		this.storage.get('CONEXION').then((conn)=>{
				if (conn && conn['url']!=''){
					//Tengo s_conn
					this.set_this_conexion_data(conn)
				}
			})
		if (file_conn['url']){
			this.has_conf = true
			this.conexion_data = file_conn
		}
	}


	create_apk_dir()	{
		this.explorer.checkDir(this.explorer.externalRootDirectory + 'Documents/', 'comunitea.reg_time.com').then((exist) => {
			if (!exist) {
			this.explorer.createDir(this.explorer.externalRootDirectory + 'Documents/', 'comunitea.reg_time.com', true).then((val) => {
			this.presentAlert('Se ha creado un nuevo fichero de configuración:', val);
		}
		
		).catch(
			(error) => {
				this.presentAlert('Error al crear un fichero de configuración:', error);
			}
		)
		}})
	
	}



    presentAlert(titulo, texto) {
        const alert = this.alertCtrl.create({
            title: titulo,
            subTitle: texto,
            buttons: ['Ok']
        });
        alert.present();
    }


	check_valid_values(){
		if (this.conexion_data.url && this.conexion_data.url.length < 3) {return false}
		if (this.conexion_data.db && this.conexion_data.db.length < 3) {return false}
		if (this.conexion_user.username && this.conexion_user.username.length < 3) {return false}
		if (this.conexion_user.password && this.conexion_user.password.length < 3) {return false}
		return true
	}
	get_storage_conexion(){
		this.s_conn = {
			url: this.conexion_data.url,
			port: this.conexion_data.port,
			db: this.conexion_data.db, 
			username: this.conexion_user.username,
			password: this.conexion_user.password,
			user: this.conexion_user.user,
			user_id: this.conexion_user.user_id
		}
		return this.s_conn
	}
	set_this_conexion_data(s_conn){
		this.conexion_data.url = s_conn.url
		this.conexion_data.port = s_conn.port
		this.conexion_data.db = s_conn.db
		this.conexion_user.username = s_conn.username
		this.conexion_user.password = s_conn.password
	}
	conectarApp(verificar){
		this.player.play('click')
		this.cargar = true;
		if (!this.check_valid_values){
			this.presentAlert('Error!', 'Valores de conexión no válidos!');
			return
		}
		if (verificar){
		//Guardo en storage los últimos valores.	
		
 		this.storage.set('CONEXION', this.get_storage_conexion()).then(() => {
			
				this.load_user(this.conexion_data, this.conexion_user)})
			
		}

	}		

	load_user(con, user){
		var model = 'hr.employee'
		//Conectamos
		this.odoo.login(user.username, user.password).then ((uid)=>{
			// Conexion OK.
			// Guardo en storage y fichero
			this.login = uid
			user.user_id = uid
			this.odoo.uid = uid
			var values = {'user_id': uid}
			// Recupero Empleado
			this.odoo.execute(model, 'get_employee_info', values).then((data)=>{
				if (data['error']){
					this.presentAlert('Error!', data['error_msg']);
					this.cargar =false;
				}
				else {
				
					let	employee = data['data']
					console.log(employee)
					user.user = uid
				
					this.explorer.writeFile(this.explorer.externalRootDirectory + 'Documents/comunitea.reg_time.com/', 'reg.json', JSON.stringify(con), {replace:true});
					this.cargar = false;
					this.employee = employee['employee']
					this.apk = employee['apk']						
					this.storage.set('APK_IMAGE', this.apk['image']).then(() => {}).catch(()=>{})
					document.documentElement.style.setProperty(`--logo_color`, this.apk['logo_color']);
					this.navCtrl.setRoot(ListPage, employee);
				}	
			})
			.catch((error) => {
				this.cargar =false;
				this.presentAlert('Error!', 'No se pudo recuperar los datos de cache. Error' + error);
			});
		}).catch((error) => {
			this.cargar =false;
			this.presentAlert('Error!', error['error_msg']);
		});

	}

	check_conexion(con) {	
		var model = 'res.users'
		var domain = [['login', '=', con.username]]
		var fields = ['id', 'login', 'image', 'name', 'company_id']
		this.odoo.login(con.username, con.password).then ((uid)=>{
			this.odoo.uid = uid
			this.odoo.searchRead(model, domain, fields).then((value)=>{
				var user = {id: null, name: null, image: null, login: null, cliente_id: null, company_id: null};
				if (value) { 
					if (!con.user || value[0].id != con.user['id'] || value[0].company_id[0] != con.user['company_id']){
            user = value[0];
            con.user = user
            this.odoo.searchRead('hr.employee', [['user_id', '=', con.user['id']]], this.EMPLOYEE_FIELDS,0,1).then((employee)=>{
              if (employee){
								
                console.log(employee)
                this.storage.set('CONEXION', con).then(()=>{
                  this.storage.set('EMPLEADO', employee).then(()=>{
                    this.navCtrl.setRoot(ListPage, employee);
                  })  
                })  
              }
            }).catch((error_employee) => {
							this.cargar =false;
							this.presentAlert('Error!', 'No se pudo encontrar el empleado asociado al usuario:' + con.username);
						})
          }
				}}).catch(() => {
				this.cargar =false;
				this.presentAlert('Error!', 'No se pudo encontrar el usuario:' + con.username);
			})
			.catch(() => {
				this.cargar = false;
				this.presentAlert('Error!', 'No se pudo encontrar el usuario:' + con.username);
			});
		})
	}
	
	check_storage_conexion(borrar){
		if (borrar){
			//Borramos el storage y el fichero de configuración
			this.explorer.removeDir(this.explorer.externalRootDirectory + 'Documents', 'comunitea.reg_time.com')
			this.storage.clear().then(() => {
				this.navCtrl.setRoot(HomePage);
			})

		}	
		else {
			//1º miro si está en storage
			this.storage.get('CONEXION').then((val) => {
				if (val && val['url']){
					this.conexion_data = val
				}
				else{
					// 2º miro si está en el fichero
					
					this.explorer.readAsText(this.explorer.externalRootDirectory + 'Documents/comunitea.reg_time.com/', 'reg.json').then((txt)=>{
						//Si está el fichero lo cargo y lo paso a storage
						this.conexion_data  = JSON.parse(txt)
						this.storage.set('CONEXION', this.conexion_data).then(() => {
						}).catch()

						this.presentAlert('OK!', 'Se ha recuperado la conexión del archivo de configuración.');
					}).catch((error)=>{

						this.presentAlert('Error!', 'No se ha encontrado datos de conexión!');
					})
			}
			})
		}
	}
}
