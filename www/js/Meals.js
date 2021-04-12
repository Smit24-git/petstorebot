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
  firebase.database().ref("meals").on("value",snapshot=>{
    var meals=snapshot.val();
    console.log(meals);
    Object.keys(meals).map((key)=>{
        console.log(key);
        console.log(meals[key]);
        const meal=meals[key];
        var name = meal.title;
        var price= meal.price || 5;
         document.getElementById("tableBody").innerHTML += (
           "<tr class='c7'><td style='padding: 20px'>"+name+"</td><td>" + price +"$</td></tr>");
    })
  });