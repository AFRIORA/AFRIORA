/* ==========================================
GHANA CONNECT PREMIUM JAVASCRIPT

VERSION 1
MEMBERSHIP SYSTEM
PROFILE BOOST SYSTEM
PAYMENT READY

========================================== */



// ===============================
// CURRENT USER PLAN
// FUTURE DATABASE CONNECTION
// ===============================


const premiumUser = {


id:100001,

name:"Kwame Mensah",

currentPlan:"Free Account",

country:"Ghana"


};







// ===============================
// PREMIUM PLAN DATA
// FUTURE DATABASE
// ===============================


const premiumPlans = [


{

name:"Ghana Connect Basic",

price:"GH₵20/month",

features:[

"More matches",

"Increased messaging limit",

"Better search options",

"Priority profile visibility"

]

},



{

name:"Ghana Connect Gold",

price:"GH₵50/month",

features:[

"Unlimited messaging",

"See who liked you",

"Advanced filters",

"Profile boost included",

"Priority support"

]

}


];







// ===============================
// SELECT PREMIUM PLAN
// ===============================


const planButtons = document.querySelectorAll(
".plan-card button"
);




planButtons.forEach((button,index)=>{


button.addEventListener(
"click",
()=>{


const selectedPlan =
premiumPlans[index];



upgradePlan(selectedPlan);



}

);


});









// ===============================
// UPGRADE FUNCTION
// ===============================


function upgradePlan(plan){



alert(

"Selected: "

+

plan.name

+

"\n\nPrice: "

+

plan.price

+

"\n\nPayment system coming soon."

);





/*

FUTURE VERSION:



window.location.href=

"payment.html?plan="+plan.name;



*/



}









// ===============================
// CURRENT ACCOUNT UPGRADE BUTTON
// ===============================


const upgradeButton =
document.querySelector(
".current-plan button"
);





if(upgradeButton){



upgradeButton.addEventListener(
"click",
()=>{


upgradePlan(
premiumPlans[1]
);



}

);


}









// ===============================
// PROFILE BOOST SYSTEM
// ===============================



const boostButtons =
document.querySelectorAll(
".boost-section button"
);






const boostPackages=[


{

duration:"24 Hours",

price:"GH₵5"

},


{

duration:"7 Days",

price:"GH₵20"

},


{

duration:"30 Days",

price:"GH₵50"

}


];






boostButtons.forEach(
(button,index)=>{



button.addEventListener(
"click",
()=>{


activateBoost(
boostPackages[index]
);



}

);



});








function activateBoost(boost){



alert(

"Profile Boost Selected\n\n"

+

boost.duration

+

"\nPrice: "

+

boost.price

+

"\n\nPayment system will be connected soon."

);






/*

FUTURE DATABASE:



Profile_Boosts

{

user_id:100001,

duration:"7 Days",

status:"pending"

}



*/



}









// ===============================
// USER PLAN DISPLAY
// ===============================



function loadUserPlan(){



const planText =
document.querySelector(
".current-plan h3"
);




if(planText){


planText.textContent =
premiumUser.currentPlan;


}


}







loadUserPlan();









// ===============================
// PAYMENT PREPARATION
// ===============================



function processPayment(plan){



console.log(

"Preparing payment for:",

plan

);




/*

FUTURE PAYMENT METHODS:


MTN Mobile Money

Vodafone Cash

AirtelTigo Money

Visa

Mastercard

International Currency



*/



}









// ===============================
// PAGE READY
// ===============================



document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Ghana Connect Premium Loaded"
);


console.log(
"User:",
premiumUser.name
);


}

);