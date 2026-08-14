/* ==========================================
GHANA CONNECT
FORGOT PASSWORD JAVASCRIPT

VERSION 1
PASSWORD RESET SYSTEM

========================================== */



// ===============================
// ELEMENTS
// ===============================

const forgotForm =
document.getElementById("forgotForm");


const identityInput =
document.getElementById("identity");


const message =
document.getElementById("message");


const sendButton =
document.querySelector(".send-btn");





// ===============================
// SUBMIT FORM
// ===============================

forgotForm.addEventListener(
"submit",
function(e){

e.preventDefault();

sendVerificationCode();

}

);





// ===============================
// SEND VERIFICATION CODE
// ===============================

function sendVerificationCode(){

const identity =
identityInput.value.trim();



// EMPTY CHECK

if(identity===""){

message.innerHTML=
"Please enter your email or phone number.";

message.style.color="red";

return;

}



// DISABLE BUTTON

sendButton.disabled=true;

sendButton.innerHTML=
"Sending...";



message.innerHTML="";
message.style.color="green";



setTimeout(()=>{

message.innerHTML=

"Verification code sent successfully.";

sendButton.innerHTML=
"Resend Code";

startCountdown();

},2000);



/*

===============================

FUTURE BACKEND

===============================


POST

/api/forgot-password


{

identity:identity

}


SERVER


✓ User Exists

↓

Generate 6-digit code

↓

Save code

↓

Expire after 10 minutes

↓

Send Email

or

Send SMS


*/

}





// ===============================
// RESEND TIMER
// ===============================

let countdown=60;

let timer;



function startCountdown(){


clearInterval(timer);



countdown=60;



timer=setInterval(()=>{


sendButton.innerHTML=

"Resend ("+

countdown+

"s)";



countdown--;



if(countdown<0){


clearInterval(timer);


sendButton.disabled=false;


sendButton.innerHTML=
"Resend Code";


}


},1000);


}





// ===============================
// VALIDATE EMAIL
// ===============================

function validEmail(email){

const pattern=

/^[^\s@]+@[^\s@]+\.[^\s@]+$/;


return pattern.test(email);

}





// ===============================
// VALIDATE GHANA PHONE
// ===============================

function validPhone(phone){

const pattern=

/^(0|\+233)[235]\d{8}$/;


return pattern.test(phone);

}





// ===============================
// CHECK INPUT TYPE
// ===============================

identityInput.addEventListener(
"blur",
()=>{

const value=

identityInput.value.trim();



if(value===""){

return;

}



if(validEmail(value)){


message.innerHTML=
"Email detected.";

message.style.color="green";

return;

}



if(validPhone(value)){


message.innerHTML=
"Ghana phone number detected.";

message.style.color="green";

return;

}



message.innerHTML=

"Please enter a valid email or Ghana phone number.";

message.style.color="red";

});





// ===============================
// FUTURE VERIFY CODE
// ===============================

/*

verifyCode(code){

POST

/api/verify-reset-code


{

identity,

code

}


Server


↓

Correct?

↓

Allow password reset


}

*/





// ===============================
// FUTURE RESET PASSWORD
// ===============================

/*

POST

/api/reset-password


{

identity,

verificationCode,

newPassword

}


Server


↓

Hash Password

↓

Update Database

↓

Return Success


*/




// ===============================
// PAGE READY
// ===============================

document.addEventListener(
"DOMContentLoaded",
()=>{

console.log(
"Forgot Password Ready"
);

});




// ===============================
// VERSION
// ===============================

console.log(
"Forgot Password JavaScript Loaded Successfully"
);