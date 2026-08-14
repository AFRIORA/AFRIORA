/* =========================================================
   AFRIORA WELCOME PAGE
   FILE: welcome.js
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const mobileMenu =
    document.getElementById("mobileMenu");

const navMenu =
    document.getElementById("navMenu");

const loginBtn =
    document.getElementById("loginBtn");

const signupBtn =
    document.getElementById("signupBtn");

const joinBtn =
    document.getElementById("joinBtn");

const exploreBtn =
    document.getElementById("exploreBtn");

const premiumBtn =
    document.getElementById("premiumBtn");

const contactBtn =
    document.getElementById("contactBtn");



/* =========================================================
   MOBILE MENU
========================================================= */

if (mobileMenu && navMenu) {

    mobileMenu.addEventListener(
        "click",
        function () {

            navMenu.classList.toggle(
                "active"
            );

        }
    );

}



/* =========================================================
   CLOSE MOBILE MENU AFTER CLICKING LINK
========================================================= */

if (navMenu) {

    const links =
        navMenu.querySelectorAll("a");

    links.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    navMenu.classList.remove(
                        "active"
                    );

                }
            );

        }
    );

}



/* =========================================================
   LOGIN
   ---------------------------------------------------------
   IMPORTANT:
   Login must go through login.html.
   We NEVER send an unauthenticated user
   directly to dashboard.html.
========================================================= */

if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "login.html";

        }
    );

}



/* =========================================================
   CREATE ACCOUNT
========================================================= */

if (signupBtn) {

    signupBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "register.html";

        }
    );

}



/* =========================================================
   JOIN AFRIORA
========================================================= */

if (joinBtn) {

    joinBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "register.html";

        }
    );

}



/* =========================================================
   DISCOVER MORE
   ---------------------------------------------------------
   Scrolls to the features section.
========================================================= */

if (exploreBtn) {

    exploreBtn.addEventListener(
        "click",
        function () {

            const features =
                document.getElementById(
                    "features"
                );

            if (features) {

                features.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}



/* =========================================================
   PREMIUM
   ---------------------------------------------------------
   We don't allow an unauthenticated user
   to access premium directly.
========================================================= */

if (premiumBtn) {

    premiumBtn.addEventListener(
        "click",
        function () {

            const loggedIn =
                localStorage.getItem(
                    "userLoggedIn"
                ) === "true";


            if (!loggedIn) {

                window.location.href =
                    "login.html";

                return;

            }


            window.location.href =
                "premium.html";

        }
    );

}



/* =========================================================
   CONTACT
========================================================= */

if (contactBtn) {

    contactBtn.addEventListener(
        "click",
        function () {

            const name =
                document.getElementById(
                    "contactName"
                )?.value.trim();


            const email =
                document.getElementById(
                    "contactEmail"
                )?.value.trim();


            const message =
                document.getElementById(
                    "contactMessage"
                )?.value.trim();


            const result =
                document.getElementById(
                    "contactResult"
                );


            if (!name ||
                !email ||
                !message) {

                if (result) {

                    result.textContent =
                        "Please complete all fields.";

                }

                return;

            }


            if (result) {

                result.textContent =
                    "Thank you. Your message has been received.";

            }


            document.getElementById(
                "contactName"
            ).value = "";


            document.getElementById(
                "contactEmail"
            ).value = "";


            document.getElementById(
                "contactMessage"
            ).value = "";

        }
    );

}



/* =========================================================
   PREVENT ENTER KEY FROM ACCIDENTALLY SUBMITTING
   ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            event.target.tagName === "INPUT"
        ) {

            // Allow normal input behavior.

        }

    }
);



/* =========================================================
   AFRIORA STARTUP CHECK
   ---------------------------------------------------------
   welcome.html is a PUBLIC page.

   It should remain accessible to everyone.

   We do NOT automatically redirect users
   from welcome.html to dashboard.html.

   The user must deliberately choose:
   Login → login.html
   Create Account → register.html
========================================================= */

console.log(
    "AFRIORA welcome page loaded."
);