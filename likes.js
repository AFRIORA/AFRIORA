/* ==========================================
GHANA CONNECT LIKES JAVASCRIPT

VERSION 1
LIKES SYSTEM
PREMIUM ACCESS CONTROL

========================================== */







// ===============================
// CURRENT USER
// FUTURE DATABASE CONNECTION
// ===============================


const likesUser = {


id:100001,

name:"Kwame Mensah",

plan:"Free"


};












// ===============================
// LIKES DATA
// FUTURE DATABASE API
// ===============================


const likesData = [



{

id:2001,

name:"Ama Mensah",

age:26,

region:"Ashanti",

photo:"images/default-profile.png",

verified:true


},





{

id:2002,

name:"Akosua Owusu",

age:24,

region:"Greater Accra",

photo:"images/default-profile.png",

verified:true


},





{

id:2003,

name:"Abena Boateng",

age:28,

region:"Eastern Region",

photo:"images/default-profile.png",

verified:false


}



];









// ===============================
// LOAD LIKES
// ===============================


function loadLikes(){



const container =

document.getElementById(

"likesContainer"

);






if(!container){

return;

}






container.innerHTML="";








// CHECK PREMIUM


if(

likesUser.plan === "Free"

){



showLimitedLikes(container);


return;


}









displayLikes(container);



}











// ===============================
// FREE ACCOUNT VIEW
// ===============================


function showLimitedLikes(container){



const limitedLikes =

likesData.slice(0,1);








limitedLikes.forEach(user=>{



createLikeCard(

container,

user,

false

);



});









const message =

document.createElement(

"div"

);



message.className=

"empty-state";





message.innerHTML=`


<i class="fas fa-lock"></i>


<h3>

Premium Required

</h3>


<p>

Upgrade to see everyone who liked your profile.

</p>


`;





container.appendChild(message);



}











// ===============================
// PREMIUM VIEW
// ===============================


function displayLikes(container){



likesData.forEach(user=>{



createLikeCard(

container,

user,

true

);



});



}











// ===============================
// CREATE LIKE CARD
// ===============================


function createLikeCard(container,user,fullAccess){



const card =

document.createElement(

"div"

);



card.className=

"like-card";







card.innerHTML=`



<div class="like-user">


<img src="${user.photo}">



<div>


<h3>

${user.name}

</h3>


<p>

Age: ${user.age}

<br>

Region: ${user.region}

</p>


</div>


</div>





<div class="like-actions">


<button class="like-back">

<i class="fas fa-heart"></i>

Like Back

</button>





<button class="view-profile">

<i class="fas fa-user"></i>

View

</button>






<button class="message-btn">

<i class="fas fa-message"></i>

Message

</button>



</div>



`;









// LIKE BACK


card.querySelector(

".like-back"

).addEventListener(

"click",

()=>{


likeBack(user.name);


}

);









// VIEW PROFILE


card.querySelector(

".view-profile"

).addEventListener(

"click",

()=>{


viewProfile(user.id);


}

);









// MESSAGE


card.querySelector(

".message-btn"

).addEventListener(

"click",

()=>{


openMessage(user.id,user.name);


}

);









container.appendChild(card);



}











// ===============================
// LIKE BACK SYSTEM
// ===============================


function likeBack(name){



alert(

"You liked "

+

name

+

" back ❤️"

);






/*

FUTURE DATABASE:


POST /api/likes


{

sender_id:currentUser,

receiver_id:name


}



*/


}











// ===============================
// VIEW PROFILE
// ===============================


function viewProfile(id){



window.location.href=

"profile-view.html?id="+id;



}











// ===============================
// MESSAGE SYSTEM
// ===============================


function openMessage(id,name){





if(

likesUser.plan !== "Premium"

&&

likesUser.plan !== "Gold"

){



alert(

"Messaging people who liked you requires Premium."

);



window.location.href=

"premium.html";


return;


}







window.location.href=

"message.html?user="+id;



}











// ===============================
// PREMIUM BUTTON
// ===============================


function upgradePremium(){



window.location.href=

"premium.html";



}











// ===============================
// FUTURE DATABASE STRUCTURE
// ===============================


/*

TABLE:

Likes


id

sender_user_id

receiver_user_id

created_at

status





Subscriptions


id

user_id

plan

payment_status

expiry_date



*/









// ===============================
// START SYSTEM
// ===============================


document.addEventListener(

"DOMContentLoaded",

()=>{


loadLikes();


console.log(

"Ghana Connect Likes Loaded"

);



}

);