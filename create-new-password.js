/* ==========================================
GHANA CONNECT
CREATE NEW PASSWORD JAVASCRIPT

VERSION 1
PASSWORD RESET COMPLETION

========================================== */



// ===============================
// ELEMENTS
// ===============================


const passwordForm =

document.getElementById(
"passwordForm"
);



const newPassword =

document.getElementById(
"newPassword"
);



const confirmPassword =

document.getElementById(
"confirmPassword"
);



const message =

document.getElementById(
"message"
);



const strengthBar =

document.getElementById(
"strengthBar"
);



const strengthText =

document.getElementById(
"strengthText"
);





// ===============================
// SHOW / HIDE PASSWORD
// ===============================


const showNewButton =

document.getElementById(
"showNewPassword"
);



const showConfirmButton =

document.getElementById(
"showConfirmPassword"
);





showNewButton.addEventListener(

"click",

()=>{


if(newPassword.type==="password"){


newPassword.type="text";

showNewButton.innerHTML="Hide";


}

else{


newPassword.type="password";

showNewButton.innerHTML="Show";


}


}

);







showConfirmButton.addEventListener(

"click",

()=>{


if(confirmPassword.type==="password"){


confirmPassword.type="text";

showConfirmButton.innerHTML="Hide";


}

else{


confirmPassword.type="password";

showConfirmButton.innerHTML="Show";


}


}

);








// ===============================
// PASSWORD STRENGTH CHECK
// ===============================


newPassword.addEventListener(

"input",

()=>{


let password =
newPassword.value;


let strength=0;



if(password.length>=8){

strength++;

}


if(/[A-Z]/.test(password)){

strength++;

}



if(/[a-z]/.test(password)){

strength++;

}



if(/[0-9]/.test(password)){

strength++;

}



if(/[^A-Za-z0-9]/.test(password)){

strength++;

}






let percent =

(strength / 5) * 100;



strengthBar.style.width=

percent+"%";





if(strength<=2){


strengthText.innerHTML=

"Weak password";


strengthText.style.color="red";


}

else if(strength<=4){


strengthText.innerHTML=

"Medium password";


strengthText.style.color="orange";


}

else{


strengthText.innerHTML=

"Strong password ✓";


strengthText.style.color="green";


}



}

);








// ===============================
// RESET PASSWORD
// ===============================


passwordForm.addEventListener(

"submit",

function(e){


e.preventDefault();



let pass =

newPassword.value.trim();



let confirm =

confirmPassword.value.trim();





if(pass===""){


showMessage(
"Please enter a password.",
"red"
);

return;

}




if(pass.length < 8){


showMessage(
"Password must contain at least 8 characters.",
"red"
);


return;


}







if(pass !== confirm){


showMessage(
"Passwords do not match.",
"red"
);


return;


}







let button =

document.querySelector(
".reset-btn"
);



button.innerHTML=

"Saving...";

button.disabled=true;






/*

================================

FUTURE DATABASE CONNECTION

================================


POST

/api/reset-password


DATA:


{

user_id,

new_password

}



SERVER:


✓ Hash password

✓ Update database

✓ Remove reset token

✓ Log password change


================================

*/






setTimeout(()=>{



showMessage(

"Password changed successfully ✓",

"green"

);





localStorage.removeItem(
"resetCode"
);





setTimeout(()=>{


window.location.href=

"login.html";


},1500);





},2000);




});








// ===============================
// MESSAGE FUNCTION
// ===============================


function showMessage(
text,
color
){


message.innerHTML=text;


message.style.color=color;


}







// ===============================
// PAGE READY
// ===============================


document.addEventListener(

"DOMContentLoaded",

()=>{


console.log(

"Create New Password Loaded"

);


}

);





console.log(

"Ghana Connect Password Reset Ready"

);