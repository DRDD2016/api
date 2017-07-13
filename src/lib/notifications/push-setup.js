import * as admin from "firebase-admin";

//  * Initialises Firebase Admin for FCM

const initialiseFCM = () => {

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FCM_PROJECT_ID,
      clientEmail: process.env.FCM_CLIENT_EMAIL,
      privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: process.env.FCM_DATABASE
  });
  console.log('finishedInitialisingApp');

};

export default initialiseFCM;
