/* =========================================================
   AFRIORA — PROFILE SETUP STEP 2
   ---------------------------------------------------------
   STEP 2:
   Personality & Relationship Preferences

   FLOW:
   profile-step1.html
        ↓
   profile-step2.html
        ↓
   Save profileStep2
        ↓
   profile-step3.html

   IMPORTANT:
   Frontend/session protection is only for the prototype.
   Real authentication and verification must be server-side.
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const form =
    document.getElementById("stepTwoForm");

const bioInput =
    document.getElementById("bio");

const bioCount =
    document.getElementById("bioCount");

const relationshipGoalInput =
    document.getElementById("relationshipGoal");

const preferredGenderInput =
    document.getElementById("preferredGender");

const preferredAgeInput =
    document.getElementById("preferredAge");

const preferredRegionInput =
    document.getElementById("preferredRegion");

const smokingInput =
    document.getElementById("smoking");

const drinkingInput =
    document.getElementById("drinking");

const childrenInput =
    document.getElementById("children");

const message =
    document.getElementById("message");


/* =========================================================
   MESSAGE FUNCTION
========================================================= */

function showMessage(
    text,
    type = ""
) {

    if (!message) {
        return;
    }

    message.textContent =
        text;

    message.className =
        "";

    if (type) {

        message.classList.add(
            type
        );

    }

}


/* =========================================================
   CHECK LOGIN SESSION
========================================================= */

function checkLoginSession() {

    const loggedIn =
        localStorage.getItem(
            "userLoggedIn"
        ) === "true";


    const rawUser =
        localStorage.getItem(
            "currentUser"
        );


    /* -----------------------------------------
       USER IS NOT LOGGED IN
    ----------------------------------------- */

    if (!loggedIn) {

        window.location.replace(
            "welcome.html"
        );

        return null;

    }


    /* -----------------------------------------
       USER SESSION EXISTS BUT USER DATA IS MISSING
    ----------------------------------------- */

    if (!rawUser) {

        localStorage.removeItem(
            "userLoggedIn"
        );

        window.location.replace(
            "welcome.html"
        );

        return null;

    }


    /* -----------------------------------------
       READ USER
    ----------------------------------------- */

    try {

        const user =
            JSON.parse(
                rawUser
            );


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


        localStorage.removeItem(
            "currentUser"
        );

        localStorage.removeItem(
            "userLoggedIn"
        );


        window.location.replace(
            "welcome.html"
        );


        return null;

    }

}


/* =========================================================
   LOAD CURRENT USER
========================================================= */

const currentUser =
    checkLoginSession();


/* =========================================================
   STOP SCRIPT WITHOUT USER
========================================================= */

if (!currentUser) {

    throw new Error(
        "No authenticated user."
    );

}


/* =========================================================
   CHECK STEP 1
========================================================= */

function checkStepOne() {

    const rawProfile =
        localStorage.getItem(
            "profileStep1"
        );


    if (!rawProfile) {

        window.location.replace(
            "profile-step1.html"
        );

        return null;

    }


    try {

        const profile =
            JSON.parse(
                rawProfile
            );


        if (
            !profile ||
            typeof profile !== "object"
        ) {

            throw new Error(
                "Invalid profileStep1."
            );

        }


        return profile;

    } catch (error) {

        console.error(
            "Invalid profileStep1:",
            error
        );


        localStorage.removeItem(
            "profileStep1"
        );


        window.location.replace(
            "profile-step1.html"
        );


        return null;

    }

}


const profileStep1 =
    checkStepOne();


if (!profileStep1) {

    throw new Error(
        "Profile Step 1 is incomplete."
    );

}


/* =========================================================
   BIO CHARACTER COUNTER
========================================================= */

function updateBioCounter() {

    if (
        !bioInput ||
        !bioCount
    ) {

        return;

    }


    const length =
        bioInput.value.length;


    bioCount.textContent =
        length;


    if (length >= 450) {

        bioCount.style.color =
            "#d4a017";

    } else {

        bioCount.style.color =
            "";

    }


    if (length >= 500) {

        bioCount.style.color =
            "#ff687c";

    }

}


if (bioInput) {

    bioInput.addEventListener(
        "input",
        updateBioCounter
    );

}


/* =========================================================
   LOAD SAVED STEP 2 DATA
========================================================= */

function loadSavedProfile() {

    const rawProfile =
        localStorage.getItem(
            "profileStep2"
        );


    if (!rawProfile) {

        updateBioCounter();

        return;

    }


    try {

        const profile =
            JSON.parse(
                rawProfile
            );


        if (
            !profile ||
            typeof profile !== "object"
        ) {

            return;

        }


        /* -----------------------------------------
           BIO
        ----------------------------------------- */

        if (
            bioInput &&
            typeof profile.bio === "string"
        ) {

            bioInput.value =
                profile.bio;

        }


        /* -----------------------------------------
           RELATIONSHIP GOAL
        ----------------------------------------- */

        if (
            relationshipGoalInput &&
            profile.relationshipGoal
        ) {

            relationshipGoalInput.value =
                profile.relationshipGoal;

        }


        /* -----------------------------------------
           PREFERRED GENDER
        ----------------------------------------- */

        if (
            preferredGenderInput &&
            profile.preferredGender
        ) {

            preferredGenderInput.value =
                profile.preferredGender;

        }


        /* -----------------------------------------
           PREFERRED AGE
        ----------------------------------------- */

        if (
            preferredAgeInput &&
            profile.preferredAge
        ) {

            preferredAgeInput.value =
                profile.preferredAge;

        }


        /* -----------------------------------------
           PREFERRED REGION
        ----------------------------------------- */

        if (
            preferredRegionInput &&
            profile.preferredRegion
        ) {

            preferredRegionInput.value =
                profile.preferredRegion;

        }


        /* -----------------------------------------
           SMOKING
        ----------------------------------------- */

        if (
            smokingInput &&
            profile.smoking
        ) {

            smokingInput.value =
                profile.smoking;

        }


        /* -----------------------------------------
           DRINKING
        ----------------------------------------- */

        if (
            drinkingInput &&
            profile.drinking
        ) {

            drinkingInput.value =
                profile.drinking;

        }


        /* -----------------------------------------
           CHILDREN
        ----------------------------------------- */

        if (
            childrenInput &&
            profile.children
        ) {

            childrenInput.value =
                profile.children;

        }


        /* -----------------------------------------
           INTERESTS
        ----------------------------------------- */

        if (
            Array.isArray(
                profile.interests
            )
        ) {

            const checkboxes =
                document.querySelectorAll(
                    '.interest-box input[type="checkbox"]'
                );


            checkboxes.forEach(
                function (checkbox) {

                    checkbox.checked =
                        profile.interests.includes(
                            checkbox.value
                        );

                }
            );

        }


        updateBioCounter();

    } catch (error) {

        console.error(
            "Could not load profileStep2:",
            error
        );

    }

}


loadSavedProfile();


/* =========================================================
   GET SELECTED INTERESTS
========================================================= */

function getSelectedInterests() {

    const selected = [];


    const checkboxes =
        document.querySelectorAll(
            '.interest-box input[type="checkbox"]:checked'
        );


    checkboxes.forEach(
        function (checkbox) {

            if (checkbox.value) {

                selected.push(
                    checkbox.value
                );

            }

        }
    );


    return selected;

}


/* =========================================================
   VALIDATE FORM
========================================================= */

function validateProfile() {

    /* -----------------------------------------
       BIO
    ----------------------------------------- */

    if (
        bioInput &&
        bioInput.value.trim().length > 500
    ) {

        showMessage(
            "Your bio must be 500 characters or less.",
            "error"
        );

        bioInput.focus();

        return false;

    }


    /* -----------------------------------------
       RELATIONSHIP GOAL
    ----------------------------------------- */

    if (
        !relationshipGoalInput ||
        !relationshipGoalInput.value
    ) {

        showMessage(
            "Please select what you are looking for.",
            "error"
        );

        if (relationshipGoalInput) {

            relationshipGoalInput.focus();

        }

        return false;

    }


    /* -----------------------------------------
       PREFERRED GENDER
    ----------------------------------------- */

    if (
        !preferredGenderInput ||
        !preferredGenderInput.value
    ) {

        showMessage(
            "Please select your preferred partner gender.",
            "error"
        );

        if (preferredGenderInput) {

            preferredGenderInput.focus();

        }

        return false;

    }


    /* -----------------------------------------
       PREFERRED AGE
    ----------------------------------------- */

    if (
        !preferredAgeInput ||
        !preferredAgeInput.value
    ) {

        showMessage(
            "Please select a preferred age range.",
            "error"
        );

        if (preferredAgeInput) {

            preferredAgeInput.focus();

        }

        return false;

    }


    /* -----------------------------------------
       PREFERRED REGION
    ----------------------------------------- */

    if (
        !preferredRegionInput ||
        !preferredRegionInput.value
    ) {

        showMessage(
            "Please select your preferred location.",
            "error"
        );

        if (preferredRegionInput) {

            preferredRegionInput.focus();

        }

        return false;

    }


    /* -----------------------------------------
       INTERESTS
    ----------------------------------------- */

    const interests =
        getSelectedInterests();


    if (interests.length === 0) {

        showMessage(
            "Please select at least one interest.",
            "error"
        );

        return false;

    }


    return true;

}


/* =========================================================
   SAVE PROFILE STEP 2
========================================================= */

function saveProfileStep2() {

    const profile = {

        userId:
            currentUser.id || null,


        /* -----------------------------------------
           BIO
        ----------------------------------------- */

        bio:
            bioInput
                ? bioInput.value.trim()
                : "",


        /* -----------------------------------------
           RELATIONSHIP GOAL
        ----------------------------------------- */

        relationshipGoal:
            relationshipGoalInput
                ? relationshipGoalInput.value
                : "",


        /* -----------------------------------------
           PARTNER PREFERENCES
        ----------------------------------------- */

        preferredGender:
            preferredGenderInput
                ? preferredGenderInput.value
                : "",


        preferredAge:
            preferredAgeInput
                ? preferredAgeInput.value
                : "",


        preferredRegion:
            preferredRegionInput
                ? preferredRegionInput.value
                : "",


        /* -----------------------------------------
           INTERESTS
        ----------------------------------------- */

        interests:
            getSelectedInterests(),


        /* -----------------------------------------
           LIFESTYLE
        ----------------------------------------- */

        smoking:
            smokingInput
                ? smokingInput.value
                : "",


        drinking:
            drinkingInput
                ? drinkingInput.value
                : "",


        children:
            childrenInput
                ? childrenInput.value
                : "",


        /* -----------------------------------------
           COMPLETION
        ----------------------------------------- */

        completed:
            true,


        completedAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "profileStep2",
        JSON.stringify(
            profile
        )
    );


    /* -----------------------------------------
       UPDATE USER SESSION
    ----------------------------------------- */

    const updatedUser = {

        ...currentUser,

        profileStep1Complete:
            true,

        profileStep2Complete:
            true,

        profileComplete:
            false

    };


    localStorage.setItem(
        "currentUser",
        JSON.stringify(
            updatedUser
        )
    );


    return profile;

}


/* =========================================================
   SUBMIT FORM
========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (!validateProfile()) {

                return;

            }


            /* -----------------------------------------
               SUBMIT BUTTON
            ----------------------------------------- */

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

            }


            showMessage(
                "Saving your preferences..."
            );


            /* -----------------------------------------
               SAVE
            ----------------------------------------- */

            try {

                saveProfileStep2();


                showMessage(
                    "Step 2 completed successfully.",
                    "success"
                );


                /* -----------------------------------------
                   CONTINUE TO STEP 3
                ----------------------------------------- */

                setTimeout(
                    function () {

                        window.location.replace(
                            "profile-step3.html"
                        );

                    },
                    700
                );


            } catch (error) {

                console.error(
                    "Profile Step 2 save error:",
                    error
                );


                showMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                }

            }

        }
    );

}


/* =========================================================
   GLOBAL AFRIORA PROFILE API
========================================================= */

window.AFRIORA_PROFILE_STEP2 = {

    getCurrentUser:
        function () {

            return checkLoginSession();

        },


    getProfileStep2:
        function () {

            const raw =
                localStorage.getItem(
                    "profileStep2"
                );


            if (!raw) {

                return null;

            }


            try {

                return JSON.parse(
                    raw
                );

            } catch {

                return null;

            }

        },


    getInterests:
        function () {

            return getSelectedInterests();

        },


    save:
        saveProfileStep2

};


/* =========================================================
   FINAL INITIALIZATION
========================================================= */

updateBioCounter();