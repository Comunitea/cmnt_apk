import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }

  public async get(key: string) {
    let result = await this._storage?.get(key);
    return result
  }

  public async get_conexion_data() {
    const url = await this.get('url');
    const db = await this.get('db');
    const port = await this.get('port');
    const username = await this.get('username');
    const password = await this.get('password');
    const user = await this.get('user');
    const user_id = await this.get('user_id');
    let con_data = {
        url: await this.get('url'),
        db: await this.get('db'),
        port: await this.get('port'),
        username: await this.get('username'),
        password: await this.get('password'),
        user: await this.get('user'),
        user_id: await this.get('user_id'),
    }
    return con_data;
  }
}