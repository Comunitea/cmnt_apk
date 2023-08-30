import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@capacitor-community/native-audio';

@Injectable()
export class AudioPlayer {
    audioType: string = 'html5';
    sounds: any = [];

    constructor(platform: Platform) {
        this.sounds = [];
        this.preload('click', 'click.mp3');
        this.preload('check_in', 'check_in.mp3');
        this.preload('check_out', 'check_out.mp3');
        this.preload('ok', 'ok.mp3');
        this.preload('gps_ok', 'gps_ok.mp3');
        this.preload('error', 'error.mp3');
    }

    preload(key: any, asset: any) {

        let audio = {
            key: key,
            asset: asset,
            type: 'html5'
        };

        this.sounds.push(audio);

        NativeAudio.preload(
            {
                assetId: key,
                assetPath: asset,
                audioChannelNum: 1,
                isUrl: false
            }
        );     

    }

    play(key: any){

        let audio = this.sounds.find((sound: { key: any; }) => {
            return sound.key === key;
        });

        NativeAudio.play(audio.key).then((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
            let audioAsset = new Audio("/assets/sounds/" + audio.asset);
            audioAsset.play();
        });

    }

}