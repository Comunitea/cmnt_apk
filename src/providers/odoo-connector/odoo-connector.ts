import { Dialog } from '@capacitor/dialog';
import { Injectable } from '@angular/core';
import { StorageService } from '../storage/storage';



/*
  Generated class for the OdooProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var OdooApi: any;


@Injectable()
export class OdooProvider {

    context
    uid: any
    ip: any
    url: any
    db: any
    username: any
    password: any
    
    constructor(private storage: StorageService) {
      this.context = {'lang': 'es_ES', 'from_pda': true}
      this.uid = 0
    }
    
    public async login(){
        var self = this
		let conn = await this.storage.get_conexion_data();
        if (!conn || !conn.url || !conn.db || !conn.port || !conn.username || !conn.password){
            this.presentAlert("Error!", "No hay datos para establecer la conexión");
        }
        var promise = await new Promise( (resolve, reject) => {
            try {
                var odoo = new OdooApi(conn.url, conn.db);
                odoo.login(conn.username, conn.password).then((uid: any) => {
                if (uid['error']){
                    reject(uid['error_msg'])
                }
                resolve(uid)
                })
                .catch( (data: any) => {
                    reject(data);
                });
            } catch (error) {
                console.log("error => ", error);
                reject(error);
            }
            
        });
        return promise
    }

    public async execute(model: any, method: string, values: any) {
        var self = this
        let conn = await this.storage.get_conexion_data();
        console.log("execute");
        console.log("conn => ", conn);
        var promise = await new Promise( (resolve, reject) => {
            var odoo = new OdooApi(conn.url, conn.db);
            odoo.context = self.context
            odoo.login(conn.username, conn.password).then((uid: any) => {
                console.log("model => ", model);
                console.log("method => ", method);
                console.log("values => ", values);
                    odoo.call(model, method, values).then((res: unknown) => {
                        console.log("res => ", res);
                        resolve(res);
                    })
                    .catch( () => {
                        var err = {'title': 'Error!', 'msg': 'Fallo al llamar al método ' + method + 'del modelo app.regustry'}
                        reject(err);
                    });
            })
            .catch( () => {
                var err = {'title': 'Error!', 'msg': 'No se pudo conectar con Odoo'}
                reject(err);
            });
        });
        return promise
    }
    /*domain=None, fields=None, offset=0, limit=None, order=None, context=None*/
    public async write (model: any, id: any, data: any){
        
        var self = this
        let conn = await this.storage.get_conexion_data();
        var promise = await new Promise( (resolve, reject) => {
            var odoo = new OdooApi(conn.url, conn.db);
            odoo.context = self.context
            odoo.login(conn.username, conn.password).then( (uid: any) => {
                odoo.write(model, id, data).then((res: unknown) => {
                    resolve(res);
                })
                .catch( () => {
                    var err = {'title': 'Error!', 'msg': 'Fallo al llamar al hacer un write'}
                    reject(err);
                });
            })
            .catch( () => {
                var err = {'title': 'Error!', 'msg': 'No se pudo conectar con Odoo'}
                reject(err);
            });
        });
        return promise
    }
    public async searchRead_2(model: any, domain: any, fields: any, offset = 0, limit = 0, order = ''){
      var model = model;
      var domain = domain;
      var fields = fields;
      var self = this
      let conn = await this.storage.get_conexion_data();
      var promise = await new Promise( (resolve, reject) => {
        var odoo = new OdooApi(conn.url, conn.db);
        odoo.context = self.context
        odoo.uid = this
        odoo.search_read(model, domain, fields, offset, limit, order).then((res: unknown) => {
            resolve(res);
        })
        .catch( () => {
            var err = {'title': 'Error!', 'msg': 'Fallo al llamar al hacer search_read'}
            reject(err);
        });
      });
      return promise
  }

    

    public async searchRead(model: any, domain: any, fields: any, offset = 0, limit = 0, order = ''){
        var model = model;
        var domain = domain;
        var fields = fields;
        var self = this
        let conn = await this.storage.get_conexion_data();
        var promise = await new Promise( (resolve, reject) => {
            var odoo = new OdooApi(conn.url, conn.db);
            odoo.context = self.context
            odoo.login(conn.username, conn.password).then( (uid: any) => {
            
            odoo.search_read(model, domain, fields, offset, limit, order).then((res: unknown) => {
                resolve(res);
            })
            .catch( () => {
                var err = {'title': 'Error!', 'msg': 'Fallo al llamar al hacer search_read'}
                reject(err);
            });
            })
            .catch( () => {
                var err = {'title': 'Error!', 'msg': 'No se pudo conectar con Odoo'}
                reject(err);
            });
        });
        return promise
    }

    presentAlert(titulo: string, texto: any) {
        const showAlert = async () => {
          await Dialog.alert({
            title: titulo,
            message: texto,
          });
        };  
    };
    

}