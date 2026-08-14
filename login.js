/* =========================================================
   AFRIORA LOGIN SYSTEM
   ---------------------------------------------------------
   LOGIN METHODS:

   1. Email / Username + Password
   2. Google
   3. Apple

   FLOW:

   Welcome
      ↓
   Login
      ↓
   Choose login method
      ↓
   Validate authentication
      ↓
   Save currentUser
      ↓
   userLoggedIn = true
      ↓
   Developer account?
      ↓
   Dashboard

   IMPORTANT:

   Google / Apple authentication shown here is prepared
   for OAuth/OIDC integration.

   Real provider authentication must be connected to
   a secure backend/authentication provider.

   NEVER place real developer passwords or API secrets
   inside frontend JavaScript.
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


const identifierInput =
    document.getElementById(
        "loginIdentifier"
    );


const passwordInput =
    document.getElementById(
        "loginPassword"
    );


const togglePassword =
    document.getElementById(
        "togglePassword"
    );


const loginSubmit =
    document.getElementById(
        "loginSubmit"
    );


const loginResult =
    document.getElementById(
        "loginResult"
    );


const rememberMe =
    document.getElementById(
        "rememberMe"
    );


/* =========================================================
   SOCIAL LOGIN BUTTONS
========================================================= */

const googleLogin =
    document.getElementById(
        "googleLogin"
    );


const appleLogin =
    document.getElementById(
        "appleLogin"
    );


/* =========================================================
   SHOW / HIDE PASSWORD
========================================================= */

if (
    togglePassword &&
    passwordInput
) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";


                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );


            } else {

                passwordInput.type =
                    "password";


                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =========================================================
   LOGIN MESSAGE
========================================================= */

function showLoginMessage(
    message,
    type = ""
) {

    if (!loginResult) {

        return;

    }


    loginResult.textContent =
        message;


    loginResult.className =
        "login-result";


    if (type) {

        loginResult.classList.add(
            type
        );

    }

}


/* =========================================================
   GET REGISTERED USERS
========================================================= */

function getUsers() {

    const rawUsers =
        localStorage.getItem(
            "afrioraUsers"
        );


    if (!rawUsers) {

        return [];

    }


    try {

        const users =
            JSON.parse(
                rawUsers
            );


        return Array.isArray(users)
            ? users
            : [];


    } catch (error) {

        console.error(
            "Invalid afrioraUsers data:",
            error
        );


        return [];

    }

}


/* =========================================================
   FIND USER
========================================================= */

function findUser(
    identifier
) {

    const users =
        getUsers();


    const search =
        identifier
            .trim()
            .toLowerCase();


    return users.find(
        function (user) {

            if (!user) {

                return false;

            }


            const email =
                String(
                    user.email || ""
                ).toLowerCase();


            const username =
                String(
                    user.username || ""
                ).toLowerCase();


            return (

                email === search ||

                username === search

            );

        }
    );

}


/* =========================================================
   CREATE USER SESSION
========================================================= */

function createSession(
    user,
    loginMethod = "password"
) {

    /*
       NEVER put the user's password
       inside currentUser.
    */

    const currentUser = {

        id:
            user.id,


        username:
            user.username || "",


        email:
            user.email || "",


        firstName:
            user.firstName || "",


        lastName:
            user.lastName || "",


        profileComplete:
            user.profileComplete === true,


        accountType:
            user.accountType ||
            "user",


        isDeveloper:
            user.isDeveloper === true,


        /*
           Record how the user authenticated.
        */

        loginMethod:
            loginMethod,


        /*
           Useful for future security
           and account-management features.
        */

        lastLoginAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "currentUser",
        JSON.stringify(
            currentUser
        )
    );


    localStorage.setItem(
        "userLoggedIn",
        "true"
    );


    localStorage.setItem(
        "loginMethod",
        loginMethod
    );


    localStorage.setItem(
        "rememberMe",
        rememberMe &&
        rememberMe.checked
            ? "true"
            : "false"
    );


    return currentUser;

}


/* =========================================================
   REDIRECT AFTER LOGIN
========================================================= */

function redirectAfterLogin(
    currentUser
) {

    if (
        !currentUser
    ) {

        window.location.replace(
            "welcome.html"
        );

        return;

    }


    /*
       Developer status is stored in the
       session for the dashboard to use.

       The actual admin authorization must
       eventually be checked by the backend.
    */

    if (
        currentUser.isDeveloper ===
        true
    ) {

        localStorage.setItem(
            "developerAccount",
            "true"
        );

    } else {

        localStorage.removeItem(
            "developerAccount"
        );

    }


    /* -----------------------------------------
       PROFILE COMPLETE
       → DASHBOARD
    ----------------------------------------- */

    if (
        currentUser.profileComplete ===
        true
    ) {

        window.location.replace(
            "dashboard.html"
        );

        return;

    }


    /* -----------------------------------------
       PROFILE INCOMPLETE
       → PROFILE SETUP
    ----------------------------------------- */

    window.location.replace(
        "profile-step1.html"
    );

}


/* =========================================================
   NORMAL EMAIL / USERNAME LOGIN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const identifier =
                identifierInput
                    ?.value
                    .trim();


            const password =
                passwordInput
                    ?.value || "";


            /* -----------------------------------------
               VALIDATE IDENTIFIER
            ----------------------------------------- */

            if (!identifier) {

                showLoginMessage(
                    "Enter your email or username.",
                    "error"
                );

                return;

            }


            /* -----------------------------------------
               VALIDATE PASSWORD
            ----------------------------------------- */

            if (!password) {

                showLoginMessage(
                    "Enter your password.",
                    "error"
                );

                return;

            }


            /* -----------------------------------------
               DISABLE LOGIN BUTTON
            ----------------------------------------- */

            if (loginSubmit) {

                loginSubmit.disabled =
                    true;

            }


            showLoginMessage(
                "Signing you in..."
            );


            /* -----------------------------------------
               FIND ACCOUNT
            ----------------------------------------- */

            const user =
                findUser(
                    identifier
                );


            setTimeout(
                function () {


                    /* ---------------------------------
                       ACCOUNT NOT FOUND
                    --------------------------------- */

                    if (!user) {

                        showLoginMessage(
                            "Account not found. Check your details or create an account.",
                            "error"
                        );


                        if (loginSubmit) {

                            loginSubmit.disabled =
                                false;

                        }


                        return;

                    }


                    /* ---------------------------------
                       PASSWORD CHECK

                       CURRENTLY FOR LOCAL PROTOTYPE.

                       PRODUCTION VERSION MUST USE
                       SERVER-SIDE HASHING.
                    --------------------------------- */

                    if (
                        user.password !==
                        password
                    ) {

                        showLoginMessage(
                            "Incorrect login details.",
                            "error"
                        );


                        if (loginSubmit) {

                            loginSubmit.disabled =
                                false;

                        }


                        return;

                    }


                    /* ---------------------------------
                       CREATE SESSION
                    --------------------------------- */

                    const currentUser =
                        createSession(
                            user,
                            "password"
                        );


                    showLoginMessage(
                        "Login successful.",
                        "success"
                    );


                    /* ---------------------------------
                       REDIRECT
                    --------------------------------- */

                    setTimeout(
                        function () {

                            redirectAfterLogin(
                                currentUser
                            );

                        },
                        500
                    );


                },
                500
            );

        }
    );

}


/* =========================================================
   GOOGLE LOGIN
   ---------------------------------------------------------
   PREPARED FOR GOOGLE OAUTH / OIDC
========================================================= */

if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        function () {

            /*
               We do NOT pretend Google authentication
               succeeded here.

               The real system will redirect the user
               to Google's authentication service.
            */

            showLoginMessage(
                "Connecting to Google..."
            );


            /*
               TEMPORARY PROTOTYPE MESSAGE.

               Later this will become something similar to:

               window.location.href =
                   "/auth/google";
            */

            setTimeout(
                function () {

                    showLoginMessage(
                        "Google authentication will be connected here.",
                        "error"
                    );

                },
                700
            );

        }
    );

}


/* =========================================================
   APPLE LOGIN
   ---------------------------------------------------------
   PREPARED FOR APPLE SIGN IN
========================================================= */

if (appleLogin) {

    appleLogin.addEventListener(
        "click",
        function () {

            showLoginMessage(
                "Connecting to Apple..."
            );


            /*
               TEMPORARY PROTOTYPE MESSAGE.

               Later this will connect to Apple's
               Sign in with Apple authentication flow.
            */

            setTimeout(
                function () {

                    showLoginMessage(
                        "Apple authentication will be connected here.",
                        "error"
                    );

                },
                700
            );

        }
    );

}


/* =========================================================
   DEVELOPER ACCOUNT CHECK
========================================================= */

function isDeveloperAccount() {

    const rawUser =
        localStorage.getItem(
            "currentUser"
        );


    if (!rawUser) {

        return false;

    }


    try {

        const user =
            JSON.parse(
                rawUser
            );


        return (
            user &&
            user.isDeveloper ===
            true
        );


    } catch (error) {

        return false;

    }

}


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

    const rawUser =
        localStorage.getItem(
            "currentUser"
        );


    if (!rawUser) {

        return null;

    }


    try {

        return JSON.parse(
            rawUser
        );


    } catch (error) {

        return null;

    }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem(
        "currentUser"
    );


    localStorage.removeItem(
        "userLoggedIn"
    );


    localStorage.removeItem(
        "loginMethod"
    );


    localStorage.removeItem(
        "developerAccount"
    );


    window.location.replace(
        "welcome.html"
    );

}


/* =========================================================
   GLOBAL AFRIORA AUTH SYSTEM
========================================================= */

window.AFRIORA_AUTH = {

    isDeveloperAccount:
        isDeveloperAccount,

    getCurrentUser:
        getCurrentUser,

    logout:
        logout

};