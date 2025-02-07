// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  API_URL: "https://api.iotasmart.com",
  AUTOML_API_URL: "https://ai.iotasmart.com/api",
  CLIENT_ID: "iotasmart",
  CLIENT_SECRET: "iotasmart-auth",
  APIKEY: 'IOTASMART',
  ANN_URL: "https://api.iotasmart.com/annn",
  ARS_URL: "https://api.iotasmart.com/ars",
  MQTT_URL: "pubsub.iotasmart.com",
  TCL_API_URL: "https://predictedgeapi.iotasmart.com",
  production: false,
  defaultauth: 'fakebackend',
  firebaseConfig: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
