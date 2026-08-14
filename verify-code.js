/* ==========================================
GHANA CONNECT
VERIFY CODE JAVASCRIPT

VERSION 1
6 DIGIT VERIFICATION SYSTEM

========================================== */



// ===============================
// ELEMENTS
// ===============================


const inputs =

document.querySelectorAll(
".code-input"
);



const verifyForm =

document.getElementById(
"verifyForm"
);



const message =

document.getElementById(
"message"
);





// ===============================
// AUTO MOVE BETWEEN INPUTS
// ===============================


inputs.forEach(

(input,index)=>{


input.addEventListener(

"input",

()=>{


if(input.value.length===1){


if(index < inputs.length-1){


inputs[index+1].focus();


}


}


}


);



input.addEventListener(

"keydown",

(event)=>{


if(

event.key==="Backspace"

&&

input.value===""

){


if(index>0){


inputs[index-1].focus();


}


}


}


);


}

);






// ===============================
// ONLY ALLOW NUMBERS
// ===============================


inputs.forEach(

input=>{


input.addEventListener(

"input",

()=>{


input.value =

input.value.replace(

/[^0-9]/g,

""

);


}


);


}

);






// ===============================
// VERIFY CODE
// ===============================


verifyForm.addEventListener(

"submit",

function(e){


e.preventDefault();



let code="";



inputs.forEach(

input=>{


code += input.value;


}

);





if(code.length !== 6){


message.innerHTML=

"Please enter the complete 6-digit code.";


message.style.color="red";


return;


}





let button=

document.querySelector(

".verify-btn"

);



button.innerHTML=

"Checking...";


button.disabled=true;





/*

=================================

FUTURE BACKEND CONNECTION

=================================


POST

/api/verify-code


DATA:


{

identity:user,

code:code

}



SERVER CHECK:


✓ Code exists

✓ Code matches

✓ Code not expired


SUCCESS:


Allow password reset


=================================

*/





setTimeout(()=>{


// DEMO ONLY


if(code==="123456"){


message.innerHTML=

"Code verified successfully ✓";


message.style.color=

"green";





setTimeout(()=>{


window.location.href=

"create-new-password.html";


},1000);



}

else{


message.innerHTML=

"Invalid verification code.";


message.style.color=

"red";



button.innerHTML=

"Verify Code";


button.disabled=false;


}



},1500);



});








// ===============================
// RESEND CODE
// ===============================


const resendLink =

document.querySelector(

".resend a"

);



let resendTime=60;



if(resendLink){


resendLink.addEventListener(

"click",

function(e){


e.preventDefault();



resendLink.style.pointerEvents=

"none";



let timer =

setInterval(()=>{


resendLink.innerHTML=

"Resend in "

+

resendTime

+

"s";



resendTime--;





if(resendTime<0){


clearInterval(timer);



resendTime=60;



resendLink.innerHTML=

"Resend Code";



resendLink.style.pointerEvents=

"auto";


}


},1000);



/*

FUTURE:


Send new SMS/email code


*/




}

);


}







// ===============================
// PAGE READY
// ===============================


document.addEventListener(

"DOMContentLoaded",

()=>{


console.log(

"Verification Page Loaded"

);


}

);





console.log(

"Ghana Connect Verify Code Ready"

);