import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js";
import "https://cdnjs.cloudflare.com/ajax/libs/pouchdb/7.2.2/pouchdb.min.js";

// var PouchDB = require('pouchdb-node');

const firebaseConfig= {
    apiKey: "AIzaSyCgkRLWk6nisGT9if3Ppqe9JeSqYyEG2M8",
    authDomain: "fir-todo-4f614.firebaseapp.com",
    projectId: "fir-todo-4f614",
    storageBucket: "fir-todo-4f614.appspot.com",
    messagingSenderId: "419286696168",
    appId: "1:419286696168:web:f025c4896542e62b16895d",
    measurementId: "G-0GJ5G4R093"
} 

firebase.initializeApp(firebaseConfig);
window.storeOrder=(details,order)=>{
    alert("storing order");
    firebase.database().ref('orders').push({
        details: details,
        order: order
        }).then(() => {
            alert("Your Order is Saved!");
            window.storeOrderLocal(details,order);
        }).catch(e => {
            alert(e);
            window.open("", "_self");
            window.close(); 
    });

}

window.storeOrderLocal=(details,order)=>{
    const db = new PouchDB('diner');
    const doc = {
        _id:order.sNumber+"-"+Math.floor(Math.random() * (80000 - 0) + 0),
        details:details,
        order:order
    };

    db.put(doc).then((res) => {
        alert("Information is Stored on your local browser!");
        window.open("", "_self");
        window.close(); 
    }).catch((err) => {
        alert(err);
        window.open("", "_self");
        window.close(); 
    });
    // window.open("", "_self");
    // window.close(); 
}

