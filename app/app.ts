import { Component, Type, ViewChild } from '@angular/core';
import { Events, Nav, Platform, LoadingController } from 'ionic-angular';
import { GoogleAnalytics, Keyboard, Splashscreen, StatusBar } from 'ionic-native';
import { Deploy } from '@ionic/cloud-angular';

import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { TabsPage } from './pages/tabs/tabs';
import { TutorialPage } from './pages/tutorial/tutorial';


@Component({
  templateUrl: 'build/app.html'
})
export class LustrumApp {
  @ViewChild(Nav) private nav: Nav;

  constructor(
    private events: Events,
    private platform: Platform,
    private authService: AuthService,
    private notifier: NotificationService,
    private deploy: Deploy,
    private loadingCtrl: LoadingController
  ) {
    this.initializeRootPage();
    this.listenToLogoutEvent();
    if (this.platform.is('cordova')) {
      this.initializeCordova();
    }
  }

  private initializeCordova() {
    this.platform.ready().then(() => {
      this.runDeploy();
      Keyboard.disableScroll(true);
      GoogleAnalytics.startTrackerWithId('UA-79997582-1');
      GoogleAnalytics.enableUncaughtExceptionReporting(true);
    });
  }

  private initializeRootPage() {
    this.authService.tryAuthentication().then((authenticated: boolean) => {
      let pageToLoad = authenticated ? TabsPage : TutorialPage;
      this.nav.setRoot(pageToLoad);
      this.platform.ready().then(() => {
        setTimeout(() => {
          Splashscreen.hide();
        }, 400);
      });
    });
  }

  private runDeploy() {
    this.deploy.check().then((result: boolean) => {
      if (result === true) {
        let loading = this.loadingCtrl.create({
          content: 'Update installeren...'
        });
        loading.present();
        Splashscreen.hide();
        this.deploy.download().then((result: boolean) => {
          if (result) {
            this.deploy.extract().then((result: boolean) => {
              if (result) {
                Splashscreen.show();
                this.deploy.load();
              } else {
                loading.dismiss();
              }
            }, (error: string) => {
              loading.dismiss();
              let message = 'Update installeren mislukt: ' + error;
              this.notifier.notify(message);
            });
          } else {
            loading.dismiss();
          }
        }, (error: string) => {
          loading.dismiss();
          let message = 'Update downloaden mislukt: ' + error;
          this.notifier.notify(message);
        });
      } else {
        Splashscreen.hide();
      }
    }, (error: string) => {
      let message = 'Update mislukt: ' + error;
      this.notifier.notify(message);
      Splashscreen.hide();
    });
  }

  private listenToLogoutEvent() {
    this.events.subscribe('user:logout', () => {
      this.nav.setRoot(TutorialPage);
    });
  }
}
