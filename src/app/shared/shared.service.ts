import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public access_token = '';
  public sessionData: any;
  // public offset: any = this.offsetValue();
  public currDate = new Date();
  public userDetails: any;
  public userId: any;
  public user:any
  public header: any;
  public automlHeader: any;
  public username: any;
  public messageList = [];
  public mqttClient : any;
  public mqttTopic = "";
  public  messages: { text: string; user: boolean; timestamp: Date }[] = [];
  constructor(private http: HttpClient) {
    this.initSessionData();
    this.initAdminData();
  }

  offsetValue() {
    var offst: any = this.currDate.getTimezoneOffset();
    const h = Math.round(offst / 60) * 100;
    const m = ((offst / 60) - Math.round(offst / 60)) * 60;
    const offsetInH = (h + m) * -1;

    if (offsetInH > 0) {
      return offst = '+' + offsetInH;
    }
    else {
      return offst = '' + offsetInH;
    }
  }
  initAdminData() {
    if (sessionStorage.getItem('userDetail') !== null) {
      this.userDetails = JSON.parse(sessionStorage.getItem('userDetail') || '');
      this.userId = this.userDetails.user.id;
      this.user = this.userDetails.user;
      this.username = this.userDetails.user.username;
    }
  }

  updateAdminData(session: any) {
    sessionStorage.setItem('userDetail', JSON.stringify(session));
    this.userDetails = session;
    this.userId = this.userDetails.user.id;
    this.user = this.userDetails.user;
    this.username = this.userDetails.user.username;
  }

  initSessionData() {
    if (sessionStorage.getItem('login') !== null) {
      this.sessionData = JSON.parse(sessionStorage.getItem('login') || '');

      this.access_token = this.sessionData.access_token;
      // this.refresh_token = this.sessionData.refresh_token;
      this.user = this.sessionData.user;
      this.username = this.sessionData.username;
      this.header = {
        headers: new HttpHeaders().set('token', `${this.access_token}`)
      };

      this.automlHeader = {
        headers: new HttpHeaders().set('Authorization', this.sessionData.automlToken)
      };
    }

  }

  updateSessionData(session: any) {
    session.automlToken = 'dbe368e6042d79bab25ecf2dc5927934652fb2472eb74aedac6927bd9b4d257b';
    sessionStorage.setItem('login', JSON.stringify(session));
    this.sessionData = session;
    this.access_token = this.sessionData.access_token;
    // this.refresh_token = this.sessionData.refresh_token;

    this.header = {
      headers: new HttpHeaders().set('token', `${this.access_token}`)
    };

    this.automlHeader = {
      headers: new HttpHeaders().set('Authorization', session.automlToken)
    };
  }

  public subscribeToTopic(topicName: string) {
    console.log(topicName);
    if (topicName && topicName.length > 1) {
      this.mqttTopic = topicName;
    }
    if (this.mqttClient && this.mqttClient.isConnected() && this.mqttTopic.length > 1) {
      this.mqttClient.subscribe(this.mqttTopic, {});
    }
  }
  
  public unsubscribeToTopic(topicName: string) {
    this.mqttTopic = "";
    if (this.mqttClient && this.mqttClient.isConnected()) {
      this.mqttClient.unsubscribe(topicName, {});
    }
  }
  
  public resetMessageList() {
    this.messageList = [];
  }
  // public subscribeToTopic(topicName: string) {  
  //   console.log(topicName)
  //   if(topicName && topicName.length > 1){
  //     this.mqttTopic = topicName;
  //   }   
  //   if(this.mqttClient.isConnected() && this.mqttTopic.length > 1){
  //     this.mqttClient.subscribe(this.mqttTopic, {});
  //   }
  // }

  // public unsubscribeToTopic(topicName: string) {
  //   this.mqttTopic = "";
  //   if(this.mqttClient.isConnected()){
  //     this.mqttClient.unsubscribe(topicName, {});
  //   }
  // }

  // public resetMessageList(){
  //   this.messageList = [];
  // }

  logout() {
    this.header = null;
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('userDetail');
    localStorage.clear();
  }

  private mqttmessageSubject = new BehaviorSubject<String>(null);
  mqttmessage$ = this.mqttmessageSubject.asObservable();

  pushMessageToAnyComp(string: String) {
    this.mqttmessageSubject.next(string);
  }
  chatBoatAsk(data:any){
    // let url = "http://3.111.218.149:9000/ask?"
    let url = "http://climatedge.iotasmart.com:9000/ask"
    http://climatedge.iotasmart.com/zh/login
    // let url = this.sharedService.TCL_API_URL +"/maintenance";
    // console.log(url)
    return this.http.post(url,data);
  }}
