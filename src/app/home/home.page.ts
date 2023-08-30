import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { AudioPlayer } from '../../providers/audio/audio';
import { OdooProvider } from '../../providers/odoo-connector/odoo-connector';
import { StorageService } from '../../providers/storage/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
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
		
	login: string = '';
	employee: any = {}
	apk: any= {};
	cargar = false;
	mensaje = '';
	login_server = false
	apk_image = false;

  constructor(private storage: StorageService, private audio: AudioPlayer, private odoo: OdooProvider, private router: Router) {
    this.create_apk_dir();
    this.get_conexion_data();
  }

	/* Crea el directorio del APK si no existe. */
	async create_apk_dir()	{
    try {
      const dir = await Filesystem.readdir({
        path: 'comunitea.reg_time.com',
        directory: Directory.Documents
      });
    } catch(e) {
      console.error('Unable to read dir', e);

      try {
        const dir = await Filesystem.mkdir({
          path: 'comunitea.reg_time.com',
          directory: Directory.Documents
        });
      } catch(e) {
        this.presentAlert('Error al crear un fichero de configuración:', e);
      }

    }
	}

  	/* evaluo los datos de la conexión.*/
  	async get_conexion_data(){
		await this.storage.get_conexion_data().then((conn: any)=>{
			this.conexion_data.url = conn.url;
			this.conexion_data.db = conn.db;
			this.conexion_data.port = conn.port;
			this.conexion_user.username = conn.username;
			this.conexion_user.password = conn.password;
		})
	}

  	/* Obtiene los datos de conexión. */
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

  	/* Establece los datos de conexión. */
  	async set_this_conexion_data(){
		await this.storage.set("url", this.conexion_data.url);
		await this.storage.set("port", this.conexion_data.port);
		await this.storage.set("db", this.conexion_data.db);
		await this.storage.set("username", this.conexion_user.username);
		await this.storage.set("password", this.conexion_user.password);
	}

  	conectarApp(){
		this.audio.play('click');
		this.cargar = true;
		this.set_this_conexion_data();
		this.load_user()
	}

  	async load_user(){
		var model = 'hr.employee'
		//Conectamos
		await this.odoo.login().then ((uid: any)=>{
			console.log("uid => ", uid);
			// Conexion OK.
			// Guardo en storage y fichero
			this.login = uid
			this.storage.set("user_id", uid);
			this.conexion_user.user_id = uid
			this.odoo.uid = uid
			var values = {'user_id': uid}
			// Recupero Empleado
			this.odoo.execute(model, 'get_employee_info', values).then((data: any)=>{
				console.log("data => ", data);
				if (data['error']){
					this.presentAlert('Error!', data['error_msg']);
					this.cargar =false;
				}
				else {
				
					let	employee = data['data']
					this.conexion_user.user = uid;

					const writeSecretFile = async () => {
						await Filesystem.writeFile({
							path: 'comunitea.reg_time.com/reg.json',
							data: JSON.stringify(this.get_storage_conexion()),
							directory: Directory.Documents,
							encoding: Encoding.UTF8,
						});
					};
					this.cargar = false;
					this.employee = employee['employee']
					this.apk = employee['apk']						
					this.storage.set('APK_IMAGE', this.apk['image']);
					document.documentElement.style.setProperty(`--logo_color`, this.apk['logo_color']);
					this.storage.set('EMPLEADO', employee)
					this.router.navigate(['/page-list']);
				}	
			})
			.catch((error: string) => {
				this.cargar =false;
				this.presentAlert('Error!', 'No se pudo recuperar los datos de cache. Error' + error);
			});
		}).catch((error: { [x: string]: any; }) => {
			this.cargar =false;
			this.presentAlert('Error!', error['error_msg']);
		});

	}

  	presentAlert(titulo: string, texto: any) {
    const showAlert = async () => {
      Dialog.alert({
        title: titulo,
        message: texto,
      });
    };
  }

}
