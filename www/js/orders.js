import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js"

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
  firebase.database().ref("orders").on("value",snapshot=>{
    var orders=snapshot.val();
    console.log(orders);
    Object.keys(orders).map((key)=>{
        console.log(key);
        console.log(orders[key]);
        const order=orders[key];
        console.log(order.shippingDetails.name);
         $("#tableBody").prepend("<tr><td>"+order.shippingDetails.name.full_name+"</td></tr>");
    })
  });