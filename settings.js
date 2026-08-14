/* ==========================================
GHANA CONNECT SETTINGS JAVASCRIPT

VERSION 1
ACCOUNT MANAGEMENT SYSTEM

========================================== */







// ===============================
// CURRENT USER SETTINGS
// FUTURE DATABASE CONNECTION
// ===============================


const settingsUser = {


id:100001,

name:"Kwame Mensah",

email:"user@example.com",

plan:"Free Account"


};








// ===============================
// EDIT PROFILE
// ===============================

function editProfile(){

window.location.href =

"profile-step1.html";

}






// ===============================
// CHANGE PASSWORD
// ===============================


function changePassword(){



const confirmChange =

confirm(

"Do you want to change your password?"

);






if(confirmChange){



alert(

"Password change page will open soon."

);





/*

FUTURE VERSION:


window.location.href=

"change-password.html";



*/



}



}











// ===============================
// SECURITY SETUP
// ===============================


function securitySetup(){



alert(

"Two Factor Authentication setup will be available soon."

);





/*

FUTURE FEATURES:


SMS verification

Email verification

Authenticator app



*/



}












// ===============================
// PREMIUM MANAGEMENT
// ===============================


function managePremium(){



window.location.href =

"premium.html";


}












// ===============================
// BLOCKED USERS
// ===============================


function blockedUsers(){



alert(

"No blocked users currently."

);



/*

FUTURE DATABASE:


Blocked_Users


id

user_id

blocked_user_id

date_created



*/



}












// ===============================
// DELETE ACCOUNT
// ===============================


function deleteAccount(){





const confirmDelete =

confirm(

"Are you sure you want to permanently delete your account?"

);







if(confirmDelete){





const finalConfirm =

confirm(

"This action cannot be undone. Continue?"

);








if(finalConfirm){



// FUTURE DATABASE ACTION


localStorage.clear();






alert(

"Account deletion request submitted."

);





window.location.href=

"login.html";




}






}



}











// ===============================
// SAVE NOTIFICATION SETTINGS
// ===============================



const notificationInputs =

document.querySelectorAll(

".toggle-item input"

);









notificationInputs.forEach(

(input)=>{



input.addEventListener(

"change",

()=>{



const notificationSettings = {


messages:

document.querySelectorAll(".toggle-item input")[0].checked,


matches:

document.querySelectorAll(".toggle-item input")[1].checked,


likes:

document.querySelectorAll(".toggle-item input")[2].checked



};






localStorage.setItem(

"notificationSettings",

JSON.stringify(notificationSettings)

);







console.log(

"Notification settings saved",

notificationSettings

);



}

);



});











// ===============================
// PROFILE VISIBILITY
// ===============================



const visibility =

document.getElementById(

"visibility"

);








if(visibility){



visibility.addEventListener(

"change",

()=>{



localStorage.setItem(

"profileVisibility",

visibility.value

);






console.log(

"Profile visibility:",

visibility.value

);



}

);



}












// ===============================
// LOAD SAVED SETTINGS
// ===============================



function loadSettings(){



const savedVisibility =

localStorage.getItem(

"profileVisibility"

);






if(savedVisibility && visibility){



visibility.value =

savedVisibility;



}







const savedNotifications =

localStorage.getItem(

"notificationSettings"

);






if(savedNotifications){



console.log(

"Saved notification settings:",

JSON.parse(savedNotifications)

);



}





}











// ===============================
// PAGE START
// ===============================



document.addEventListener(

"DOMContentLoaded",

()=>{



loadSettings();




console.log(

"Ghana Connect Settings Loaded"

);



console.log(

"User:",

settingsUser.name

);



}

);