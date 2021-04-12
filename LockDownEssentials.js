const Order = require("./Order");
const Meal = require("./meal");
const firebase = require('firebase');
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
let database = firebase.database();

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    DISH:   Symbol("food"),
});
const availableMeals=[];
firebase.database().ref("meals").on("value",snapshot=>{
    var meals=snapshot.val();
    console.log(meals);
    Object.keys(meals).map((key)=>{
        const meal=meals[key];
        availableMeals.push(
            new Meal(
                key,
                meal.title,
                meal.price || 5,
                meal.meta_description,
                meal.full_description,
                meal.featured_image
            )
        );
    });
});

module.exports = class LockDownEssentials extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sDish = {};
    }
    setCurrentStateToDish=()=>{
        this.stateCur=OrderState.DISH;    
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.DISH;
                aReturn.push("Welcome to Smit's Dinner.");
                aReturn.push(`For a list of what we sell tap:`);
                aReturn.push(`${this.sUrl}/ViewProducts`);
                
                aReturn.push("Which dish would you like for today?");
                break;
            case OrderState.DISH:
                if(sInput.toLowerCase() == "no"){
                    this.sDish = null;
                    this.isDone(true);
                    aReturn.push("Your Order has been cancelled. Thank you for your time.");
                }else{
                    var isAvailable=false;
                    //check dish details
                    availableMeals.forEach((meal)=>{
                        if(meal.title.toLowerCase() == sInput.toLowerCase()){
                            
                            this.sDish= meal;
                            console.log(this.sDish);
                            aReturn.push(`Price: $${this.sDish.price}.`);
                            aReturn.push("Click on this link to complete the payment Process.");
                            aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                            this.stateCur = OrderState.PAYMENT;
                            isAvailable=true;
                        }
                    });
                    if(!isAvailable){
                        aReturn.push(`Dish unavailable! Please try again with different dish!`);
                        console.log(aReturn);
                        this.stateCur=OrderState.DISH;
                    }
                    
                }
                break;
            case OrderState.PAYMENT:
                this.isDone(true);
                console.log(sInput);
                if(this.sDish!=null){
                    //payment process...
                    aReturn.push(`Thank you for ordering ${this.sDish.title}.`)
                }
                break;
        }
        console.log(aReturn);
        return aReturn;
    }
    renderPaymentForm(){
        // your client id should be kept private
        const sClientID = process.env.SB_CLIENT_ID || 'AfBebXG8nX7V2jXKrgWSeRnmXIljCx5C3SpwRNLTYiMEppIy8oTL3ULikovSlWcDamUF3-9RHyZUa24l'
        return(`
        <!DOCTYPE html>
    
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
          <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
        </head>
        
        <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
          
          <script src="/js/order.js" type="module"></script>
          <script
            src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
          </script>
          Thank you ${this.sNumber} for your order of $${this.sDish.price}.
          <div id="paypal-button-container"></div>
    
          <script>
            paypal.Buttons({
                createOrder: function(data, actions) {
                  // This function sets up the details of the transaction, including the amount and line item details.
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: '${this.sDish.price}'
                      }
                    }]
                  });
                },
                onApprove: function(data, actions) {
                  // This function captures the funds from the transaction.
                  return actions.order.capture().then(function(details) {
  
                    // This function shows a transaction success message to your buyer.
                    $.post(".",{details:details},()=>{
                       window.storeOrder(details,${JSON.stringify(this)});
                    //  window.open("", "_self");
                    //  window.close(); 
                    });
                  });
                }
            
              }).render('#paypal-button-container');
            // This function displays Smart Payment Buttons on your web page.
          </script>
        
        </body>
            
        `);
    
      }

      
    static renderForm(){
      // your client id should be kept private
      return(`
      <html>
      <head>
          <meta content="text/html; charset=UTF-8" http-equiv="content-type">
          <style type="text/css">
              ol {
                  margin: 0;
                  padding: 0
              }
      
              table td,
              table th {
                  padding: 0
              }
      
              .c1 {
                  border-right-style: solid;
                  padding: 5pt 5pt 5pt 5pt;
                  border-bottom-color: #000000;
                  border-top-width: 1pt;
                  border-right-width: 1pt;
                  border-left-color: #000000;
                  vertical-align: top;
                  border-right-color: #000000;
                  border-left-width: 1pt;
                  border-top-style: solid;
                  border-left-style: solid;
                  border-bottom-width: 1pt;
                  width: 234pt;
                  border-top-color: #000000;
                  border-bottom-style: solid
              }
      
              .c13 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 36pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c0 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 26pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c2 {
                  color: #000000;
                  font-weight: 400;
                  text-decoration: none;
                  vertical-align: baseline;
                  font-size: 11pt;
                  font-family: "Arial";
                  font-style: normal
              }
      
              .c9 {
                  padding-top: 12pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left;
                  height: 11pt
              }
      
              .c12 {
                  padding-top: 12pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c3 {
                  padding-top: 0pt;
                  padding-bottom: 0pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c10 {
                  padding-top: 0pt;
                  padding-bottom: 0pt;
                  line-height: 1.0;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c4 {
                  padding-top: 0pt;
                  padding-bottom: 7pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: right
              }
      
              .c8 {
                  padding-top: 0pt;
                  padding-bottom: 7pt;
                  line-height: 1.15;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .c11 {
                  border-spacing: 0;
                  border-collapse: collapse;
                  margin-right: auto
              }
      
              .c5 {
                  background-color: #ffffff;
                  max-width: 468pt;
                  padding: 72pt 72pt 72pt 72pt
              }
      
              .c6 {
                  height: 48.2pt
              }
      
              .c7 {
                  height: 52pt
              }
      
              .c15 {
                  font-size: 26pt
              }
      
              .c14 {
                  height: 11pt
              }
      
              .title {
                  padding-top: 0pt;
                  color: #000000;
                  font-size: 26pt;
                  padding-bottom: 3pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              .subtitle {
                  padding-top: 0pt;
                  color: #666666;
                  font-size: 15pt;
                  padding-bottom: 16pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              li {
                  color: #000000;
                  font-size: 11pt;
                  font-family: "Arial"
              }
      
              p {
                  margin: 0;
                  color: #000000;
                  font-size: 11pt;
                  font-family: "Arial"
              }
      
              h1 {
                  padding-top: 20pt;
                  color: #000000;
                  font-size: 20pt;
                  padding-bottom: 6pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h2 {
                  padding-top: 18pt;
                  color: #000000;
                  font-size: 16pt;
                  padding-bottom: 6pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h3 {
                  padding-top: 16pt;
                  color: #434343;
                  font-size: 14pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h4 {
                  padding-top: 14pt;
                  color: #666666;
                  font-size: 12pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h5 {
                  padding-top: 12pt;
                  color: #666666;
                  font-size: 11pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
      
              h6 {
                  padding-top: 12pt;
                  color: #666666;
                  font-size: 11pt;
                  padding-bottom: 4pt;
                  font-family: "Arial";
                  line-height: 1.15;
                  page-break-after: avoid;
                  font-style: italic;
                  orphans: 2;
                  widows: 2;
                  text-align: left
              }
          </style>
      </head>
      
      <body class="c5">
          <p class="c3"><span
                  class="c2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </p>
          <p class="c10"><span class="c0">Menu for next events</span></p>
          <table class="c11" id='tableBody'>
          </table>
          <script src='js/Meals.js' type='module'>
          

          </script>
      </body>
      </html>      `);
  
    }
}
