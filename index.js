/* =========================================================
   AFRIORA SPLASH SYSTEM
   ---------------------------------------------------------
   FLOW:

   index.html
       ↓
   welcome.html
       ↓
   Login / Register

   IMPORTANT:
   The splash page does NOT open the dashboard.
   Authentication is handled after welcome.html.
========================================================= */


/* =========================================================
   CREATE FLOATING PARTICLES
========================================================= */

const particles =
    document.getElementById("particles");


if (particles) {

    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const particle =
            document.createElement("span");


        particle.className =
            "particle";


        particle.style.left =
            Math.random() * 100 + "%";


        particle.style.animationDelay =
            Math.random() * 5 + "s";


        particle.style.animationDuration =
            5 +
            Math.random() * 7 +
            "s";


        const size =
            2 +
            Math.random() * 4;


        particle.style.width =
            size + "px";


        particle.style.height =
            size + "px";


        particles.appendChild(
            particle
        );

    }

}


/* =========================================================
   START AFRIORA
========================================================= */

window.addEventListener(
    "load",
    function () {

        setTimeout(
            function () {

                /*
                 * ALWAYS SEND THE USER
                 * TO THE WELCOME PAGE.
                 */

                window.location.replace(
                    "welcome.html"
                );

            },

            4000

        );

    }
);