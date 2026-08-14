```javascript
// ==========================================
// GHANA CONNECT
// DASHBOARD JAVASCRIPT — FIXED
// FILE: dashboard.js
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Ghana Connect Dashboard starting...");

    /*
     * IMPORTANT FIX:
     *
     * The old code rejected the DEVELOPMENT LOGIN because
     * GC-DEVELOPMENT-USER does not exist inside
     * ghanaConnectUsers.
     *
     * The old code also required userProfile.completed === true
     * before allowing dashboard.html to open.
     *
     * This version trusts the authenticated currentUser session
     * created by login.js.
     */

    const currentUser =
        getLocalStorageObject("currentUser");

    const userLoggedIn =
        localStorage.getItem("userLoggedIn") === "true";


    // ==========================================
    // CHECK LOGIN SESSION
    // ==========================================

    if (!currentUser || !userLoggedIn) {

        console.warn(
            "No valid Ghana Connect login session."
        );

        window.location.replace("login.html");

        return;
    }


    console.log(
        "Authenticated user:",
        currentUser
    );


    // ==========================================
    // LOAD USER PROFILE
    // ==========================================

    const userProfile =
        getLocalStorageObject("userProfile");


    let activeProfile = null;


    if (
        userProfile &&
        profileBelongsToCurrentUser(
            userProfile,
            currentUser
        )
    ) {

        activeProfile = userProfile;

    }


    // ==========================================
    // USER NAME
    // ==========================================

    const fullName =
        (
            activeProfile &&
            (
                activeProfile.fullName ||
                activeProfile.name
            )
        ) ||

        currentUser.fullName ||

        currentUser.name ||

        "Member";


    const firstName =
        fullName
            .trim()
            .split(/\s+/)[0];


    const currentUserName =
        document.getElementById(
            "currentUserName"
        );


    const welcomeUserName =
        document.getElementById(
            "welcomeUserName"
        );


    if (currentUserName) {

        currentUserName.textContent =
            fullName;

    }


    if (welcomeUserName) {

        welcomeUserName.textContent =
            firstName;

    }


    // ==========================================
    // USER PHOTO
    // ==========================================

    const photo =
        (
            activeProfile &&
            (
                activeProfile.photo ||
                (
                    Array.isArray(
                        activeProfile.photos
                    ) &&
                    activeProfile.photos[0]
                )
            )
        ) ||

        currentUser.photo ||

        "images/default-profile.png";


    const photoElement =
        document.getElementById(
            "currentUserPhoto"
        );


    if (photoElement) {

        photoElement.src = photo;


        photoElement.onerror =
            function () {

                this.onerror = null;

                this.src =
                    "images/default-profile.png";

            };

    }


    // ==========================================
    // PROFILE COMPLETION
    // ==========================================

    let completion = 100;


    if (activeProfile) {

        completion =
            calculateProfileCompletion(
                activeProfile
            );

    }


    /*
     * If login.js says the profile is complete,
     * always show 100%.
     */

    if (
        currentUser.profileComplete === true
    ) {

        completion = 100;

    }


    const completionPercent =
        document.getElementById(
            "completionPercent"
        );


    const profileProgress =
        document.getElementById(
            "profileProgress"
        );


    if (completionPercent) {

        completionPercent.textContent =
            completion + "%";

    }


    if (profileProgress) {

        profileProgress.style.width =
            completion + "%";


        profileProgress.setAttribute(
            "aria-valuenow",
            completion
        );

    }


    // ==========================================
    // LOAD DASHBOARD STATISTICS
    // ==========================================

    loadDashboardStats();


    // ==========================================
    // SETUP DASHBOARD UI
    // ==========================================

    setupSidebarNavigation();

    setupLogout();

    setupMobileSidebar();

    fixProfileLinks();


    console.log(
        "Ghana Connect Dashboard Ready."
    );

});


// ==========================================
// SAFE LOCALSTORAGE OBJECT
// ==========================================

function getLocalStorageObject(key) {

    try {

        const value =
            localStorage.getItem(key);


        if (!value) {

            return null;

        }


        const parsed =
            JSON.parse(value);


        if (
            parsed &&
            typeof parsed === "object" &&
            !Array.isArray(parsed)
        ) {

            return parsed;

        }


        return null;

    }
    catch (error) {

        console.error(
            "Could not read localStorage:",
            key,
            error
        );

        return null;

    }

}


// ==========================================
// SAFE LOCALSTORAGE ARRAY
// ==========================================

function getLocalStorageArray(key) {

    try {

        const value =
            localStorage.getItem(key);


        if (!value) {

            return [];

        }


        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed
            : [];

    }
    catch (error) {

        console.error(
            "Could not read localStorage array:",
            key,
            error
        );

        return [];

    }

}


// ==========================================
// NORMALIZE PHONE
// ==========================================

function normalizePhone(phone) {

    return String(phone || "")
        .replace(/\D/g, "");

}


// ==========================================
// PROFILE BELONGS TO CURRENT USER
// ==========================================

function profileBelongsToCurrentUser(
    profile,
    currentUser
) {

    if (
        !profile ||
        !currentUser
    ) {

        return false;

    }


    // ======================================
    // USER ID
    // ======================================

    const profileUserId =
        String(
            profile.userId ||
            profile.accountId ||
            profile.accountID ||
            ""
        ).trim();


    const currentUserId =
        String(
            currentUser.id ||
            currentUser.userId ||
            currentUser.accountId ||
            ""
        ).trim();


    if (
        profileUserId &&
        currentUserId &&
        profileUserId === currentUserId
    ) {

        return true;

    }


    // ======================================
    // GHANA CARD
    // ======================================

    if (
        profile.ghanaCard &&
        currentUser.ghanaCard &&
        String(profile.ghanaCard).trim() ===
        String(currentUser.ghanaCard).trim()
    ) {

        return true;

    }


    // ======================================
    // EMAIL
    // ======================================

    const profileEmail =
        String(
            profile.email || ""
        )
        .trim()
        .toLowerCase();


    const currentEmail =
        String(
            currentUser.email || ""
        )
        .trim()
        .toLowerCase();


    if (
        profileEmail &&
        currentEmail &&
        profileEmail === currentEmail
    ) {

        return true;

    }


    // ======================================
    // PHONE
    // ======================================

    const profilePhone =
        normalizePhone(
            profile.phone
        );


    const currentPhone =
        normalizePhone(
            currentUser.phone
        );


    if (
        profilePhone &&
        currentPhone &&
        profilePhone === currentPhone
    ) {

        return true;

    }


    // ======================================
    // DEVELOPMENT USER
    // ======================================

    if (
        currentUser.id ===
        "GC-DEVELOPMENT-USER"
    ) {

        return true;

    }


    return false;

}


// ==========================================
// PROFILE COMPLETION
// ==========================================

function calculateProfileCompletion(profile) {

    if (!profile) {

        return 0;

    }


    const fields = [

        profile.fullName,

        profile.photo ||
        (
            Array.isArray(profile.photos) &&
            profile.photos[0]
        ),

        profile.gender,

        profile.region,

        profile.city,

        profile.occupation,

        profile.education,

        profile.bio,

        profile.relationshipGoal,

        Array.isArray(profile.interests) &&
        profile.interests.length > 0,

        profile.smoking,

        profile.drinking,

        profile.children

    ];


    const completed =
        fields.filter(Boolean).length;


    return Math.round(
        (
            completed /
            fields.length
        ) * 100
    );

}


// ==========================================
// DASHBOARD STATS
// ==========================================

function loadDashboardStats() {

    let stats = {};


    try {

        stats =
            JSON.parse(
                localStorage.getItem(
                    "dashboardStats"
                )
            ) || {};

    }
    catch (error) {

        console.error(
            "Could not load dashboard statistics:",
            error
        );

    }


    const values = {

        matchCount:
            Number(stats.matches) || 0,

        messageCount:
            Number(stats.messages) || 0,

        likeCount:
            Number(stats.likes) || 0,

        profileViews:
            Number(stats.views) || 0

    };


    const elements = {

        matchCount:
            values.matchCount,

        messageCount:
            values.messageCount,

        likeCount:
            values.likeCount,

        profileViews:
            values.profileViews

    };


    Object.keys(elements)
        .forEach(function (id) {

            const element =
                document.getElementById(id);


            if (element) {

                element.textContent =
                    elements[id];

            }

        });

}


// ==========================================
// SIDEBAR NAVIGATION
// ==========================================

const pageLinks = {

    Home:
        "dashboard.html",

    Discover:
        "ghana-connect-feed.html",

    Matches:
        "match-preferences.html",

    Likes:
        "likes.html",

    Messages:
        "ghana-connect-message.html",

    Notifications:
        "notifications.html",

    Premium:
        "premium.html",

    "My Profile":
        "profile-view.html",

    Settings:
        "settings.html",

    Support:
        "support.html",

    Logout:
        "login.html"

};


// ==========================================
// SETUP SIDEBAR
// ==========================================

function setupSidebarNavigation() {

    const navigationItems =
        document.querySelectorAll(
            "#sidebar li"
        );


    navigationItems.forEach(
        function (item) {

            const text =
                item.querySelector("span");


            const link =
                item.querySelector("a");


            if (
                !text ||
                !link
            ) {

                return;

            }


            const menuName =
                text.textContent.trim();


            const page =
                pageLinks[menuName];


            if (page) {

                link.setAttribute(
                    "href",
                    page
                );

            }

        }
    );


    // ======================================
    // ACTIVE MENU
    // ======================================

    let currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (!currentPage) {

        currentPage =
            "dashboard.html";

    }


    navigationItems.forEach(
        function (item) {

            const link =
                item.querySelector("a");


            if (!link) {

                return;

            }


            const href =
                link.getAttribute("href");


            if (
                href === currentPage
            ) {

                item.classList.add(
                    "active"
                );

            }
            else {

                item.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

function setupLogout() {

    const navigationItems =
        document.querySelectorAll(
            "#sidebar li"
        );


    navigationItems.forEach(
        function (item) {

            const text =
                item.querySelector("span");


            if (
                !text ||
                text.textContent.trim() !==
                "Logout"
            ) {

                return;

            }


            const link =
                item.querySelector("a");


            if (!link) {

                return;

            }


            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const confirmLogout =
                        window.confirm(
                            "Are you sure you want to logout?"
                        );


                    if (!confirmLogout) {

                        return;

                    }


                    clearSession();


                    window.location.replace(
                        "login.html"
                    );

                }
            );

        }
    );

}


// ==========================================
// CLEAR SESSION
// ==========================================

function clearSession() {

    localStorage.removeItem(
        "currentUser"
    );

    localStorage.removeItem(
        "userLoggedIn"
    );

    localStorage.removeItem(
        "rememberLogin"
    );

}


// ==========================================
// MOBILE SIDEBAR
// ==========================================

function setupMobileSidebar() {

    const menuBtn =
        document.getElementById(
            "menuBtn"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "overlay"
        );


    if (
        !menuBtn ||
        !sidebar ||
        !overlay
    ) {

        return;

    }


    menuBtn.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "active"
            );


            overlay.classList.toggle(
                "active"
            );

        }
    );


    overlay.addEventListener(
        "click",
        function () {

            sidebar.classList.remove(
                "active"
            );


            overlay.classList.remove(
                "active"
            );

        }
    );

}


// ==========================================
// PROFILE LINKS
// ==========================================

function fixProfileLinks() {

    document
        .querySelectorAll(
            'a[href="profile.html"]'
        )
        .forEach(
            function (link) {

                link.setAttribute(
                    "href",
                    "profile-view.html"
                );

            }
        );

}


// ==========================================
// GLOBAL LOGOUT FUNCTION
// ==========================================

function logoutUser() {

    clearSession();

    window.location.replace(
        "login.html"
    );

}


// ==========================================
// DEBUG FUNCTION
// ==========================================

function debugDashboard() {

    console.log(
        "================================"
    );

    console.log(
        "GHANA CONNECT DASHBOARD DEBUG"
    );

    console.log(
        "================================"
    );

    console.log(
        "currentUser:",
        localStorage.getItem(
            "currentUser"
        )
    );

    console.log(
        "userLoggedIn:",
        localStorage.getItem(
            "userLoggedIn"
        )
    );

    console.log(
        "userProfile:",
        localStorage.getItem(
            "userProfile"
        )
    );

    console.log(
        "ghanaConnectUsers:",
        localStorage.getItem(
            "ghanaConnectUsers"
        )
    );

    console.log(
        "================================"
    );

}


// ==========================================
// END
// ==========================================

console.log(
    "Ghana Connect dashboard.js loaded."
);

console.log(
    "Run debugDashboard() in the console to inspect the session."
);
```
