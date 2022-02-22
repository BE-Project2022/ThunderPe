import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuwyJ33nGzcepfQ7AC9H8reN35hJW4kac",

  authDomain: "thunderpe-33b6a.firebaseapp.com",

  projectId: "thunderpe-33b6a",

  storageBucket: "thunderpe-33b6a.appspot.com",

  messagingSenderId: "248332353592",

  appId: "1:248332353592:web:fd726b086becd113f8e6cd"

};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage, app };
