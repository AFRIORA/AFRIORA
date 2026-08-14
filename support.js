/* ==========================================
GHANA CONNECT SUPPORT JAVASCRIPT

VERSION 1
HELP CENTER
SUPPORT REQUEST SYSTEM
BUSINESS CONTACT

========================================== */





// ===============================
// SUPPORT USER DATA
// FUTURE DATABASE CONNECTION
// ===============================


const supportUser = {


id:100001,

name:"Kwame Mensah",

email:"kwame@example.com"


};









// ===============================
// SEND SUPPORT REQUEST
// ===============================


const sendButton =

document.querySelector(
".send-btn"
);







if(sendButton){


sendButton.addEventListener(

"click",

()=>{



const subject =

document.getElementById(
"supportSubject"
).value;





const message =

document.getElementById(
"supportMessage"
).value;









if(subject.trim()==="" || message.trim()===""){



alert(

"Please complete all support fields."

);



return;


}









const supportTicket = {



ticketID:

"GC-" +

Date.now(),



userID:

supportUser.id,



name:

supportUser.name,



email:

supportUser.email,



subject:

subject,



message:

message,



status:

"Pending"



};









// SAVE TEMPORARILY

// FUTURE DATABASE API


localStorage.setItem(

"supportTicket",

JSON.stringify(supportTicket)

);









alert(

"Your support request has been submitted successfully."

);








document.getElementById(
"supportSubject"
).value="";



document.getElementById(
"supportMessage"
).value="";








console.log(

"Support Ticket:",

supportTicket

);






/*

FUTURE VERSION:


POST /api/support/tickets


DATABASE TABLE:


Support_Tickets


ticket_id

user_id

subject

message

status

created_at



*/


}

);


}











// ===============================
// BUSINESS ADVERTISING BUTTON
// ===============================



const advertiseButton =

document.querySelector(

".business-box button"

);








if(advertiseButton){



advertiseButton.addEventListener(

"click",

()=>{



window.location.href =

"advertise.html";



}

);


}












// ===============================
// FAQ INTERACTION
// ===============================



const faqItems =

document.querySelectorAll(

".faq-item"

);







faqItems.forEach(

(item)=>{



item.addEventListener(

"click",

()=>{



item.classList.toggle(

"active"

);



}

);



});












// ===============================
// LOAD PREVIOUS SUPPORT DATA
// ===============================


function loadSupportData(){



const savedTicket =

localStorage.getItem(

"supportTicket"

);







if(savedTicket){



console.log(

"Previous Support Ticket Found:",

JSON.parse(savedTicket)

);



}



}








loadSupportData();











// ===============================
// PAGE READY
// ===============================



document.addEventListener(

"DOMContentLoaded",

()=>{



console.log(

"Ghana Connect Support Loaded"

);



}

);