/* =========================================================
   GHANA CONNECT NOTIFICATIONS
========================================================= */

const NOTIFICATIONS_STORAGE_KEY =
    "ghanaConnectNotifications";


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCurrentUser();

        renderNotifications();

    }
);


/* =========================================================
   LOAD CURRENT USER
========================================================= */

function loadCurrentUser() {

    try {

        const raw =
            localStorage.getItem(
                "currentUser"
            );


        currentUser =
            raw
                ? JSON.parse(raw)
                : null;

    } catch (error) {

        console.error(
            "Could not load current user:",
            error
        );

        currentUser =
            null;

    }

}


/* =========================================================
   CURRENT USER ID
========================================================= */

function getCurrentUserId() {

    if (!currentUser) {

        return "member";

    }


    return String(

        currentUser.id ||
        currentUser.userId ||
        currentUser.accountId ||
        currentUser.ghanaCard ||
        currentUser.email ||
        currentUser.phone ||
        "member"

    ).trim();

}


/* =========================================================
   GET NOTIFICATIONS
========================================================= */

function getNotifications() {

    try {

        const raw =
            localStorage.getItem(
                NOTIFICATIONS_STORAGE_KEY
            );


        if (!raw) {

            return [];

        }


        const data =
            JSON.parse(
                raw
            );


        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "Could not load notifications:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE NOTIFICATIONS
========================================================= */

function saveNotifications(
    notifications
) {

    try {

        localStorage.setItem(

            NOTIFICATIONS_STORAGE_KEY,

            JSON.stringify(
                notifications
            )

        );

        return true;

    } catch (error) {

        console.error(
            "Could not save notifications:",
            error
        );

        return false;

    }

}


/* =========================================================
   RENDER NOTIFICATIONS
========================================================= */

function renderNotifications() {

    const container =
        document.querySelector(
            ".notification-box"
        );


    if (!container) {

        return;

    }


    const currentUserId =
        getCurrentUserId();


    const notifications =
        getNotifications()
            .filter(
                function (notification) {

                    return String(
                        notification.recipientId
                    ) ===
                    String(
                        currentUserId
                    );

                }
            );


    container.innerHTML =
        "";


    if (
        notifications.length === 0
    ) {

        container.innerHTML = `

            <div class="notification-card">

                <i class="fas fa-bell-slash"></i>

                <div>

                    <h3>
                        No Notifications
                    </h3>

                    <p>
                        You don't have any notifications yet.
                    </p>

                    <span>
                        You're all caught up.
                    </span>

                </div>

            </div>

        `;

        return;

    }


    notifications.forEach(
        function (notification) {

            container.appendChild(

                createNotificationElement(
                    notification
                )

            );

        }
    );

}


/* =========================================================
   CREATE NOTIFICATION ELEMENT
========================================================= */

function createNotificationElement(
    notification
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "notification-card";


    if (
        notification.read === false
    ) {

        card.classList.add(
            "unread"
        );

    }


    const icon =
        getNotificationIcon(
            notification.type
        );


    const title =
        getNotificationTitle(
            notification.type
        );


    const senderName =
        escapeHtml(
            notification.senderName ||
            "Member"
        );


    const message =
        escapeHtml(
            notification.message ||
            ""
        );


    const time =
        formatNotificationTime(
            notification.createdAt
        );


    card.innerHTML = `

        <i class="${icon}"></i>

        <div>

            <h3>
                ${title}
            </h3>

            <p>
                <strong>
                    ${senderName}
                </strong>

                ${message}
            </p>

            <span>
                ${time}
            </span>

        </div>

    `;


    card.addEventListener(
        "click",
        function () {

            markNotificationAsRead(
                notification.id
            );

        }
    );


    return card;

}


/* =========================================================
   NOTIFICATION ICON
========================================================= */

function getNotificationIcon(
    type
) {

    switch (type) {

        case "like":

            return "fas fa-heart";


        case "comment":

            return "fas fa-message";


        case "follow":

            return "fas fa-user-plus";


        case "message":

            return "fas fa-comment";


        default:

            return "fas fa-bell";

    }

}


/* =========================================================
   NOTIFICATION TITLE
========================================================= */

function getNotificationTitle(
    type
) {

    switch (type) {

        case "like":

            return "New Like";


        case "comment":

            return "New Comment";


        case "follow":

            return "New Follower";


        case "message":

            return "New Message";


        default:

            return "Notification";

    }

}


/* =========================================================
   MARK NOTIFICATION AS READ
========================================================= */

function markNotificationAsRead(
    notificationId
) {

    const notifications =
        getNotifications();


    const notification =
        notifications.find(
            function (item) {

                return String(
                    item.id
                ) ===
                String(
                    notificationId
                );

            }
        );


    if (!notification) {

        return;

    }


    notification.read =
        true;


    saveNotifications(
        notifications
    );


    renderNotifications();

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatNotificationTime(
    dateString
) {

    if (!dateString) {

        return "Just now";

    }


    const date =
        new Date(
            dateString
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Just now";

    }


    const seconds =
        Math.floor(

            (
                Date.now() -
                date.getTime()
            ) / 1000

        );


    if (
        seconds < 60
    ) {

        return "Just now";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (
        minutes < 60
    ) {

        return (

            minutes +

            (
                minutes === 1
                    ? " minute ago"
                    : " minutes ago"
            )

        );

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (
        hours < 24
    ) {

        return (

            hours +

            (
                hours === 1
                    ? " hour ago"
                    : " hours ago"
            )

        );

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (
        days < 7
    ) {

        return (

            days +

            (
                days === 1
                    ? " day ago"
                    : " days ago"
            )

        );

    }


    return date.toLocaleDateString();

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}