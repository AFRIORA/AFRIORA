// ==========================================
// GHANA CONNECT
// PROFILE VIEW JAVASCRIPT
// ==========================================



document.addEventListener(

"DOMContentLoaded",

()=>{



// ==========================================
// GET USER DATA
// ==========================================


const userProfile =

JSON.parse(

localStorage.getItem(

"userProfile"

)

);





const currentUser =

JSON.parse(

localStorage.getItem(

"currentUser"

)

);








// ==========================================
// CHECK LOGIN
// ==========================================



if(!currentUser || !userProfile){



window.location.href =

"login.html";


return;


}









// ==========================================
// LOAD PROFILE PHOTO
// ==========================================


let photo =

userProfile.photo ||

"images/default-profile.png";




document.getElementById(

"profilePhoto"

).src = photo;









// ==========================================
// BASIC INFORMATION
// ==========================================



document.getElementById(

"profileName"

).innerHTML =

userProfile.fullName ||

"Member";







document.getElementById(

"profileLocation"

).innerHTML =


`<i class="fa-solid fa-location-dot"></i>

${userProfile.region || "Ghana"}`;







// ==========================================
// AGE CALCULATION
// ==========================================


if(userProfile.dob){



let age =

calculateAge(

userProfile.dob

);



document.getElementById(

"profileAge"

).innerHTML =

"Age: " + age;


}









// ==========================================
// ABOUT
// ==========================================



document.getElementById(

"profileBio"

).innerHTML =

userProfile.bio ||

"No bio added yet.";









// ==========================================
// PERSONAL DETAILS
// ==========================================



document.getElementById(

"profileGender"

).innerHTML =

userProfile.gender || "-";





document.getElementById(

"profileRegion"

).innerHTML =

userProfile.region || "-";





document.getElementById(

"profileGoal"

).innerHTML =

userProfile.relationshipGoal || "-";





document.getElementById(

"profileInterests"

).innerHTML =


Array.isArray(userProfile.interests)

?

userProfile.interests.join(", ")

:

userProfile.interests || "-";









// ==========================================
// LIFESTYLE
// ==========================================



document.getElementById(

"profileSmoking"

).innerHTML =

userProfile.smoking || "-";





document.getElementById(

"profileDrinking"

).innerHTML =

userProfile.drinking || "-";





document.getElementById(

"profileChildren"

).innerHTML =

userProfile.children || "-";









// ==========================================
// PROFILE COMPLETION
// ==========================================



let completion =

calculateCompletion(

userProfile

);






document.getElementById(

"completionPercent"

).innerHTML =

completion + "%";






document.getElementById(

"profileProgress"

).style.width =

completion + "%";








});











// ==========================================
// AGE FUNCTION
// ==========================================


function calculateAge(date){



let birth =

new Date(date);



let today =

new Date();



let age =

today.getFullYear()

-

birth.getFullYear();




let month =

today.getMonth()

-

birth.getMonth();






if(

month < 0 ||

(

month===0 &&

today.getDate()

<

birth.getDate()

)

){


age--;


}





return age;


}











// ==========================================
// COMPLETION FUNCTION
// ==========================================


function calculateCompletion(profile){



let information=[


profile.fullName,

profile.photo,

profile.gender,

profile.region,

profile.bio,

profile.relationshipGoal,

profile.interests,

profile.smoking,

profile.drinking,

profile.children


];





let completed =

information.filter(

item=>item

).length;






return Math.round(

(

completed /

information.length

)

*

100

);



}









console.log(

"Ghana Connect Profile View Loaded"

);