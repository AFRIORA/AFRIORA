/* ==========================================
GHANA CONNECT ADVERTISE JAVASCRIPT

VERSION 1
BUSINESS ADVERTISING SYSTEM
CAMPAIGN REQUEST READY

========================================== */






// ===============================
// CURRENT BUSINESS USER
// FUTURE DATABASE CONNECTION
// ===============================


const advertiser = {


id:500001,

name:"Business Owner",

country:"Ghana"


};











// ===============================
// ADVERTISING PACKAGES
// ===============================


const advertisingPackages = [



{

name:"Starter",

price:"GH₵100",

duration:"7 Days"


},



{

name:"Growth",

price:"GH₵250",

duration:"30 Days"


},



{

name:"Premium",

price:"GH₵500",

duration:"60 Days"


}



];









// ===============================
// PACKAGE BUTTON SYSTEM
// ===============================


const packageButtons =

document.querySelectorAll(

".package-card button"

);







packageButtons.forEach(

(button,index)=>{



button.addEventListener(

"click",

()=>{



selectPackage(

advertisingPackages[index]

);



}

);



});












// ===============================
// SELECT AD PACKAGE
// ===============================


function selectPackage(packageData){





localStorage.setItem(

"selectedAdPackage",

JSON.stringify(packageData)

);






alert(



"Selected Advertising Package\n\n"

+

packageData.name

+

"\nPrice: "

+

packageData.price

+

"\nDuration: "

+

packageData.duration



);







/*

FUTURE PAYMENT SYSTEM:



window.location.href=

"business-payment.html";





*/



}











// ===============================
// SUBMIT BUSINESS APPLICATION
// ===============================



const submitButton =

document.querySelector(

".submit-ad"

);







if(submitButton){



submitButton.addEventListener(

"click",

()=>{





const businessName =

document.getElementById(

"businessName"

).value;






const category =

document.getElementById(

"businessCategory"

).value;







const contact =

document.getElementById(

"businessContact"

).value;








const description =

document.getElementById(

"businessDescription"

).value;









if(

businessName.trim()==="" ||

category.trim()==="" ||

contact.trim()==="" ||

description.trim()===""

){



alert(

"Please complete all business information."

);



return;



}









const application = {



applicationID:

"AD-"

+

Date.now(),



advertiserID:

advertiser.id,



businessName:

businessName,



category:

category,



contact:

contact,



description:

description,



status:

"Pending Review"



};









// TEMPORARY STORAGE

// FUTURE DATABASE API


localStorage.setItem(

"businessApplication",

JSON.stringify(application)

);









alert(

"Advertising request submitted successfully."

);









document.getElementById(

"businessName"

).value="";



document.getElementById(

"businessCategory"

).value="";



document.getElementById(

"businessContact"

).value="";



document.getElementById(

"businessDescription"

).value="";









console.log(

"Business Application:",

application

);








/*

FUTURE DATABASE TABLE:


Advertisers


id

business_name

category

contact

country

status





Advertisement_Campaigns


id

advertiser_id

package

start_date

end_date

payment_status



*/





}

);



}












// ===============================
// LOAD SAVED APPLICATION
// ===============================


function loadAdvertisingData(){



const saved =

localStorage.getItem(

"businessApplication"

);






if(saved){



console.log(

"Saved Business Application:",

JSON.parse(saved)

);



}



}









loadAdvertisingData();











// ===============================
// PAGE READY
// ===============================



document.addEventListener(

"DOMContentLoaded",

()=>{



console.log(

"Ghana Connect Advertising Loaded"

);



}

);