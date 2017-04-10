import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonicPage, LoadingController, NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth';
import { TabsPage } from '../tabs/tabs';

@IonicPage({
  segment: 'inloggen'
})
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Inloggen...'
    });

    loading.present();

    this.authService
      .login(this.loginForm.value['username'], this.loginForm.value['password'])
      .then(() => {
        this.navCtrl.push(TabsPage).then(() => {
          loading.dismiss();
        });
      })
      .catch(error => {
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Inloggen mislukt',
          message: 'Pff, die verplicht ingewikkelde wachtwoorden ook... Het kan zijn dat je even moet wachten voor je een nieuwe poging mag wagen.',
          buttons: ['Probeer het nog eens']
        });
        alert.present();
      });
  }
}
