/* =========================================================
   AFRIORA — PROFILE SETUP STEP 1
   ---------------------------------------------------------
   GLOBAL PROFILE FLOW:

   Registration
        ↓
   OTP Verification
        ↓
   Profile Setup Step 1
        ↓
   Basic Information
        ↓
   Profile Setup Step 2
        ↓
   Profile Setup Step 3
        ↓
   Complete Profile

   IMPORTANT:
   - AFRIORA is global.
   - No Ghana-specific assumptions.
   - Country comes from registration.
   - Identity verification belongs to the verification flow,
     not this profile step.
   - This frontend/session logic is for the prototype only.
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const form =
    document.getElementById("stepOneForm");

const fullNameInput =
    document.getElementById("fullName");

const countryInput =
    document.getElementById("country");

const genderInput =
    document.getElementById("gender");

const dobInput =
    document.getElementById("dob");

const cityInput =
    document.getElementById("city");

const occupationInput =
    document.getElementById("occupation");

const educationInput =
    document.getElementById("education");

const profilePhotoInput =
    document.getElementById("profilePhoto");

const photoPreview =
    document.getElementById("photoPreview");

const photoMessage =
    document.getElementById("photoMessage");

const message =
    document.getElementById("message");

const verificationStatus =
    document.getElementById("verificationStatus");

const continueButton =
    document.getElementById("continueButton");


/* =========================================================
   MESSAGE HELPERS
========================================================= */

function showMessage(text, type = "") {

    if (!message) {
        return;
    }

    message.textContent = text;

    message.className = "form-message";

    if (type) {
        message.classList.add(type);
    }
}


function showPhotoMessage(text, type = "") {

    if (!photoMessage) {
        return;
    }

    photoMessage.textContent = text;

    photoMessage.className = "field-message";

    if (type) {
        photoMessage.classList.add(type);
    }
}


/* =========================================================
   LOGIN / SESSION CHECK
========================================================= */

function checkLoginSession() {

    const loggedIn =
        localStorage.getItem("userLoggedIn") === "true";

    const rawUser =
        localStorage.getItem("currentUser");


    /* -----------------------------------------------------
       USER IS NOT LOGGED IN
    ----------------------------------------------------- */

    if (!loggedIn) {

        window.location.replace("welcome.html");

        return null;
    }


    /* -----------------------------------------------------
       SESSION EXISTS BUT USER DATA IS MISSING
    ----------------------------------------------------- */

    if (!rawUser) {

        localStorage.removeItem("userLoggedIn");

        window.location.replace("welcome.html");

        return null;
    }


    /* -----------------------------------------------------
       PARSE USER
    ----------------------------------------------------- */

    try {

        const user =
            JSON.parse(rawUser);

        if (
            !user ||
            typeof user !== "object"
        ) {

            throw new Error(
                "Invalid user session."
            );
        }

        return user;

    } catch (error) {

        console.error(
            "Invalid currentUser:",
            error
        );

        localStorage.removeItem("currentUser");
        localStorage.removeItem("userLoggedIn");

        window.location.replace("welcome.html");

        return null;
    }
}


/* =========================================================
   CURRENT USER
========================================================= */

const currentUser =
    checkLoginSession();


/* =========================================================
   STOP IF NO USER
========================================================= */

if (!currentUser) {

    throw new Error(
        "No authenticated AFRIORA user."
    );
}


/* =========================================================
   BUILD FULL NAME
========================================================= */

function getUserFullName(user) {

    if (
        user.firstName &&
        user.lastName
    ) {

        return `${user.firstName} ${user.lastName}`;
    }


    if (user.fullName) {

        return user.fullName;
    }


    if (user.name) {

        return user.name;
    }


    if (user.username) {

        return user.username;
    }


    return "";
}


/* =========================================================
   LOAD REGISTRATION INFORMATION
========================================================= */

function loadRegistrationInformation() {

    /* -----------------------------------------------------
       FULL NAME
    ----------------------------------------------------- */

    if (fullNameInput) {

        fullNameInput.value =
            getUserFullName(currentUser);
    }


    /* -----------------------------------------------------
       COUNTRY

       Country should come from registration.

       Example:

       currentUser.country = "Ghana"
       currentUser.countryCode = "GH"

       or

       currentUser.country = "Nigeria"
       currentUser.countryCode = "NG"
    ----------------------------------------------------- */

    if (countryInput) {

        const country =
            currentUser.country ||
            currentUser.countryName ||
            "";

        countryInput.value =
            country;
    }


    /* -----------------------------------------------------
       GENDER

       If already collected during registration,
       load it automatically.
    ----------------------------------------------------- */

    if (
        genderInput &&
        currentUser.gender
    ) {

        genderInput.value =
            String(
                currentUser.gender
            ).toLowerCase();
    }


    /* -----------------------------------------------------
       DATE OF BIRTH
    ----------------------------------------------------- */

    if (
        dobInput &&
        currentUser.dob
    ) {

        dobInput.value =
            currentUser.dob;
    }
}


loadRegistrationInformation();


/* =========================================================
   VERIFICATION STATUS
========================================================= */

function updateVerificationStatus() {

    if (!verificationStatus) {
        return;
    }


    /*
       These are possible frontend states.

       The real verification result must eventually
       come from your backend verification system.
    */

    const verificationState =
        currentUser.verificationStatus ||
        currentUser.identityVerificationStatus ||
        "";


    if (
        verificationState === "verified" ||
        currentUser.identityVerified === true
    ) {

        verificationStatus.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            <span>Identity verified</span>
        `;

        verificationStatus.classList.add(
            "verified"
        );

        return;
    }


    if (
        verificationState === "pending"
    ) {

        verificationStatus.innerHTML = `
            <i class="fa-solid fa-clock"></i>
            <span>Identity verification pending</span>
        `;

        verificationStatus.classList.add(
            "pending"
        );

        return;
    }


    /* Default */

    verificationStatus.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>Identity verification submitted</span>
    `;
}


updateVerificationStatus();


/* =========================================================
   LOAD SAVED STEP 1
========================================================= */

function loadSavedProfile() {

    const rawProfile =
        localStorage.getItem(
            "profileStep1"
        );


    if (!rawProfile) {
        return;
    }


    try {

        const profile =
            JSON.parse(rawProfile);


        if (
            !profile ||
            typeof profile !== "object"
        ) {

            return;
        }


        /* -------------------------------------------------
           GENDER
        ------------------------------------------------- */

        if (
            genderInput &&
            profile.gender
        ) {

            genderInput.value =
                profile.gender;
        }


        /* -------------------------------------------------
           DOB
        ------------------------------------------------- */

        if (
            dobInput &&
            profile.dob
        ) {

            dobInput.value =
                profile.dob;
        }


        /* -------------------------------------------------
           CITY
        ------------------------------------------------- */

        if (
            cityInput &&
            profile.city
        ) {

            cityInput.value =
                profile.city;
        }


        /* -------------------------------------------------
           OCCUPATION
        ------------------------------------------------- */

        if (
            occupationInput &&
            profile.occupation
        ) {

            occupationInput.value =
                profile.occupation;
        }


        /* -------------------------------------------------
           EDUCATION
        ------------------------------------------------- */

        if (
            educationInput &&
            profile.education
        ) {

            educationInput.value =
                profile.education;
        }


        /* -------------------------------------------------
           PROFILE PHOTO
        ------------------------------------------------- */

        if (
            profile.profilePhoto &&
            photoPreview
        ) {

            photoPreview.src =
                profile.profilePhoto;
        }


    } catch (error) {

        console.error(
            "Could not load profileStep1:",
            error
        );
    }
}


loadSavedProfile();


/* =========================================================
   PROFILE PHOTO
========================================================= */

if (
    profilePhotoInput &&
    photoPreview
) {

    profilePhotoInput.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];


            if (!file) {
                return;
            }


            /* -------------------------------------------------
               FILE TYPE
            ------------------------------------------------- */

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];


            if (
                !allowedTypes.includes(
                    file.type
                )
            ) {

                showPhotoMessage(
                    "Please select a JPG, PNG, or WebP image.",
                    "error"
                );

                this.value = "";

                return;
            }


            /* -------------------------------------------------
               FILE SIZE
            ------------------------------------------------- */

            const maxSize =
                5 * 1024 * 1024;


            if (
                file.size > maxSize
            ) {

                showPhotoMessage(
                    "Profile photo must be smaller than 5 MB.",
                    "error"
                );

                this.value = "";

                return;
            }


            /* -------------------------------------------------
               IMAGE PREVIEW
            ------------------------------------------------- */

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    photoPreview.src =
                        event.target.result;

                    showPhotoMessage(
                        "Photo selected successfully.",
                        "success"
                    );
                };


            reader.onerror =
                function () {

                    showPhotoMessage(
                        "Unable to read this image.",
                        "error"
                    );
                };


            reader.readAsDataURL(
                file
            );

        }
    );
}


/* =========================================================
   AGE VALIDATION
========================================================= */

function validateAge() {

    if (!dobInput) {
        return true;
    }


    const value =
        dobInput.value;


    if (!value) {

        showMessage(
            "Please enter your date of birth.",
            "error"
        );

        return false;
    }


    const birthDate =
        new Date(
            `${value}T00:00:00`
        );


    if (
        Number.isNaN(
            birthDate.getTime()
        )
    ) {

        showMessage(
            "Please enter a valid date of birth.",
            "error"
        );

        return false;
    }


    const today =
        new Date();


    let age =
        today.getFullYear() -
        birthDate.getFullYear();


    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
            birthDate.getDate()
        )
    ) {

        age--;
    }


    /* -----------------------------------------------------
       AFRIORA AGE REQUIREMENT
    ----------------------------------------------------- */

    if (age < 18) {

        showMessage(
            "You must be at least 18 years old to use AFRIORA.",
            "error"
        );

        return false;
    }


    if (age > 120) {

        showMessage(
            "Please enter a valid date of birth.",
            "error"
        );

        return false;
    }


    return true;
}


/* =========================================================
   VALIDATE PROFILE
========================================================= */

function validateProfile() {

    /* -----------------------------------------------------
       GENDER
    ----------------------------------------------------- */

    if (
        genderInput &&
        !genderInput.value
    ) {

        showMessage(
            "Please select your gender.",
            "error"
        );

        genderInput.focus();

        return false;
    }


    /* -----------------------------------------------------
       DATE OF BIRTH
    ----------------------------------------------------- */

    if (!validateAge()) {

        if (dobInput) {
            dobInput.focus();
        }

        return false;
    }


    /* -----------------------------------------------------
       CITY / TOWN
    ----------------------------------------------------- */

    if (
        cityInput &&
        !cityInput.value.trim()
    ) {

        showMessage(
            "Please enter your city or town.",
            "error"
        );

        cityInput.focus();

        return false;
    }


    /* -----------------------------------------------------
       OCCUPATION
    ----------------------------------------------------- */

    if (
        occupationInput &&
        !occupationInput.value.trim()
    ) {

        showMessage(
            "Please enter your occupation.",
            "error"
        );

        occupationInput.focus();

        return false;
    }


    /* -----------------------------------------------------
       EDUCATION
    ----------------------------------------------------- */

    if (
        educationInput &&
        !educationInput.value
    ) {

        showMessage(
            "Please select your education level.",
            "error"
        );

        educationInput.focus();

        return false;
    }


    return true;
}


/* =========================================================
   SAVE PROFILE STEP 1
========================================================= */

function saveProfileStep1() {

    const profile = {

        /* Account reference */
        userId:
            currentUser.id ||
            currentUser.userId ||
            null,


        /* Registered information */
        fullName:
            fullNameInput
                ? fullNameInput.value.trim()
                : "",


        country:
            countryInput
                ? countryInput.value.trim()
                : (
                    currentUser.country ||
                    ""
                ),


        countryCode:
            currentUser.countryCode ||
            "",


        /* Profile information */
        gender:
            genderInput
                ? genderInput.value
                : "",


        dob:
            dobInput
                ? dobInput.value
                : "",


        city:
            cityInput
                ? cityInput.value.trim()
                : "",


        occupation:
            occupationInput
                ? occupationInput.value.trim()
                : "",


        education:
            educationInput
                ? educationInput.value
                : "",


        profilePhoto:
            photoPreview
                ? photoPreview.src
                : "",


        /* Step status */
        completed:
            true,


        completedAt:
            new Date().toISOString()
    };


    /* -----------------------------------------------------
       SAVE PROFILE
    ----------------------------------------------------- */

    localStorage.setItem(
        "profileStep1",
        JSON.stringify(profile)
    );


    /* -----------------------------------------------------
       UPDATE USER SESSION
    ----------------------------------------------------- */

    const updatedUser = {

        ...currentUser,

        profileStep1Complete:
            true,

        profileComplete:
            false
    };


    localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser)
    );


    return profile;
}


/* =========================================================
   FORM SUBMISSION
========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* -------------------------------------------------
               VALIDATE
            ------------------------------------------------- */

            if (!validateProfile()) {
                return;
            }


            /* -------------------------------------------------
               DISABLE BUTTON
            ------------------------------------------------- */

            if (continueButton) {

                continueButton.disabled =
                    true;

                continueButton.classList.add(
                    "loading"
                );
            }


            showMessage(
                "Saving your profile..."
            );


            /* -------------------------------------------------
               SAVE
            ------------------------------------------------- */

            try {

                saveProfileStep1();


                showMessage(
                    "Step 1 completed successfully.",
                    "success"
                );


                /* -------------------------------------------------
                   CONTINUE TO STEP 2
                ------------------------------------------------- */

                setTimeout(
                    function () {

                        window.location.replace(
                            "profile-step2.html"
                        );

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Profile save error:",
                    error
                );


                showMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );


                if (continueButton) {

                    continueButton.disabled =
                        false;

                    continueButton.classList.remove(
                        "loading"
                    );
                }
            }

        }
    );
}


/* =========================================================
   DATE LIMITS
========================================================= */

if (dobInput) {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    /* No future birthdays */

    dobInput.max =
        `${year}-${month}-${day}`;


    /* Earliest reasonable date */

    const minimumYear =
        year - 120;


    dobInput.min =
        `${minimumYear}-${month}-${day}`;
}


/* =========================================================
   GLOBAL AFRIORA PROFILE API
========================================================= */

window.AFRIORA_PROFILE = {

    /* -----------------------------------------------------
       CURRENT USER
    ----------------------------------------------------- */

    getCurrentUser:
        function () {

            return checkLoginSession();
        },


    /* -----------------------------------------------------
       STEP 1 PROFILE
    ----------------------------------------------------- */

    getProfileStep1:
        function () {

            const raw =
                localStorage.getItem(
                    "profileStep1"
                );


            if (!raw) {
                return null;
            }


            try {

                return JSON.parse(
                    raw
                );

            } catch (error) {

                console.error(
                    "Invalid profileStep1:",
                    error
                );

                return null;
            }
        },


    /* -----------------------------------------------------
       SAVE
    ----------------------------------------------------- */

    save:
        saveProfileStep1,


    /* -----------------------------------------------------
       CHECK COMPLETION
    ----------------------------------------------------- */

    isComplete:
        function () {

            const profile =
                this.getProfileStep1();


            return Boolean(
                profile &&
                profile.completed === true
            );
        }
};


/* =========================================================
   DEBUG INFORMATION
   ---------------------------------------------------------
   Helpful during development.
========================================================= */

console.log(
    "AFRIORA Profile Step 1 loaded.",
    {
        userId:
            currentUser.id ||
            currentUser.userId ||
            null,

        country:
            currentUser.country ||
            null
    }
);