/* =========================================================
   AFRIORA MESSAGES SYSTEM
   STEP 8
   ---------------------------------------------------------
   Includes:
   - Conversations
   - Private messages
   - Send message
   - Search chats
   - New message
   - Unread messages
   - Persistent storage
   - Mobile chat view
   - Notifications
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const MESSAGES_STORAGE_KEY =
    "ghanaConnectMessages";


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;
let userProfile = null;

let activeConversationId = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCurrentUser();

        initializeMessageButtons();

        renderConversations();

    }
);


/* =========================================================
   STORAGE HELPERS
========================================================= */

function getStorageObject(key) {

    try {

        const raw =
            localStorage.getItem(key);

        if (!raw) {

            return null;

        }

        const data =
            JSON.parse(raw);

        if (
            data &&
            typeof data === "object" &&
            !Array.isArray(data)
        ) {

            return data;

        }

    } catch (error) {

        console.error(
            "Storage object error:",
            error
        );

    }

    return null;

}


function getStorageArray(key) {

    try {

        const raw =
            localStorage.getItem(key);

        if (!raw) {

            return [];

        }

        const data =
            JSON.parse(raw);

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "Storage array error:",
            error
        );

        return [];

    }

}


function saveStorageArray(
    key,
    data
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save storage:",
            error
        );

        return false;

    }

}


/* =========================================================
   CURRENT USER
========================================================= */

function loadCurrentUser() {

    currentUser =
        getStorageObject(
            "currentUser"
        );

    userProfile =
        getStorageObject(
            "userProfile"
        );


    const loggedIn =
        localStorage.getItem(
            "userLoggedIn"
        ) === "true";


    if (
        !currentUser ||
        !loggedIn
    ) {

        window.location.replace(
            "login.html"
        );

        return;

    }

}


/* =========================================================
   USER NAME
========================================================= */

function getCurrentUserName() {

    if (userProfile) {

        return (
            userProfile.fullName ||
            userProfile.name ||
            currentUser?.fullName ||
            currentUser?.name ||
            "Member"
        );

    }


    return (
        currentUser?.fullName ||
        currentUser?.name ||
        "Member"
    );

}


/* =========================================================
   USER PHOTO
========================================================= */

function getCurrentUserPhoto() {

    if (userProfile) {

        if (
            userProfile.photo
        ) {

            return userProfile.photo;

        }


        if (
            Array.isArray(
                userProfile.photos
            ) &&
            userProfile.photos.length
        ) {

            return userProfile.photos[0];

        }

    }


    return (
        currentUser?.photo ||
        "images/default-profile.png"
    );

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
        currentUser.email ||
        currentUser.phone ||
        "member"

    ).trim();

}


/* =========================================================
   MESSAGE BUTTONS
========================================================= */

function initializeMessageButtons() {


    /* =========================================
       SEARCH
    ========================================= */

    const searchButton =
        document.getElementById(
            "searchMessagesBtn"
        );


    const searchBox =
        document.getElementById(
            "messageSearchBox"
        );


    const searchInput =
        document.getElementById(
            "conversationSearch"
        );


    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                if (!searchBox) {
                    return;
                }


                if (
                    searchBox.style.display ===
                    "none"
                ) {

                    searchBox.style.display =
                        "flex";

                    if (searchInput) {

                        searchInput.focus();

                    }

                } else {

                    searchBox.style.display =
                        "none";

                    if (searchInput) {

                        searchInput.value =
                            "";

                    }

                    renderConversations();

                }

            }
        );

    }


    /* =========================================
       SEARCH INPUT
    ========================================= */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                renderConversations(
                    this.value
                );

            }
        );

    }


    /* =========================================
       NEW MESSAGE
    ========================================= */

    const newMessageButton =
        document.getElementById(
            "newMessageBtn"
        );


    const startChatButton =
        document.getElementById(
            "startChatBtn"
        );


    if (newMessageButton) {

        newMessageButton.addEventListener(
            "click",
            startNewConversation
        );

    }


    if (startChatButton) {

        startChatButton.addEventListener(
            "click",
            startNewConversation
        );

    }


    /* =========================================
       SEND MESSAGE
    ========================================= */

    const sendButton =
        document.getElementById(
            "sendMessageBtn"
        );


    const messageInput =
        document.getElementById(
            "messageInput"
        );


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );

    }


    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );

    }


    /* =========================================
       ATTACHMENT
    ========================================= */

    const attachButton =
        document.getElementById(
            "attachMessageBtn"
        );


    if (attachButton) {

        attachButton.addEventListener(
            "click",
            function () {

                showMessage(
                    "Photo and file messaging will be added next."
                );

            }
        );

    }


    /* =========================================
       CHAT OPTIONS
    ========================================= */

    const chatOptions =
        document.getElementById(
            "chatOptionsBtn"
        );


    if (chatOptions) {

        chatOptions.addEventListener(
            "click",
            function () {

                if (!activeConversationId) {

                    showMessage(
                        "Select a conversation first."
                    );

                    return;

                }


                showMessage(
                    "Chat options will be added next."
                );

            }
        );

    }

}


/* =========================================================
   GET ALL MESSAGES
========================================================= */

function getMessages() {

    return getStorageArray(
        MESSAGES_STORAGE_KEY
    );

}


/* =========================================================
   SAVE ALL MESSAGES
========================================================= */

function saveMessages(messages) {

    return saveStorageArray(
        MESSAGES_STORAGE_KEY,
        messages
    );

}


/* =========================================================
   CREATE CONVERSATION ID
========================================================= */

function getConversationId(
    userA,
    userB
) {

    const ids = [

        String(userA),

        String(userB)

    ].sort();


    return (
        ids[0] +
        "_" +
        ids[1]
    );

}


/* =========================================================
   GET CONVERSATIONS
========================================================= */

function getConversations() {

    const messages =
        getMessages();


    const currentUserId =
        getCurrentUserId();


    const conversations = {};


    messages.forEach(
        function (message) {

            const isMine =
                String(message.senderId) ===
                String(currentUserId);


            const otherUserId =
                isMine
                    ? message.receiverId
                    : message.senderId;


            if (!otherUserId) {
                return;
            }


            const conversationId =
                getConversationId(
                    currentUserId,
                    otherUserId
                );


            if (
                !conversations[
                    conversationId
                ]
            ) {

                conversations[
                    conversationId
                ] = {

                    id:
                        conversationId,

                    otherUserId:
                        otherUserId,

                    messages: []

                };

            }


            conversations[
                conversationId
            ].messages.push(
                message
            );

        }
    );


    return Object.values(
        conversations
    )

    .sort(
        function (a, b) {

            const lastA =
                a.messages[
                    a.messages.length - 1
                ];

            const lastB =
                b.messages[
                    b.messages.length - 1
                ];


            return (
                new Date(
                    lastB.createdAt
                ) -
                new Date(
                    lastA.createdAt
                )
            );

        }
    );

}


/* =========================================================
   RENDER CONVERSATIONS
========================================================= */

function renderConversations(
    searchTerm = ""
) {

    const list =
        document.getElementById(
            "conversationList"
        );


    if (!list) {
        return;
    }


    const conversations =
        getConversations();


    const normalizedSearch =
        String(
            searchTerm
        )
        .trim()
        .toLowerCase();


    const filtered =
        conversations.filter(
            function (conversation) {

                if (!normalizedSearch) {

                    return true;

                }


                const user =
                    getUserById(
                        conversation.otherUserId
                    );


                const name =
                    getUserName(
                        user
                    );


                return name
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    );

            }
        );


    list.innerHTML =
        "";


    const count =
        document.getElementById(
            "conversationCount"
        );


    if (count) {

        count.textContent =
            conversations.length +
            (
                conversations.length === 1
                    ? " conversation"
                    : " conversations"
            );

    }


    if (
        filtered.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-conversations">

                <div class="empty-icon">

                    <i class="fa-regular fa-comments"></i>

                </div>

                <h3>
                    ${
                        normalizedSearch
                            ? "No chats found"
                            : "No chats yet"
                    }
                </h3>

                <p>
                    ${
                        normalizedSearch
                            ? "Try another name."
                            : "Start a conversation with someone you connect with."
                    }
                </p>

                ${
                    !normalizedSearch
                        ? `
                            <button
                                type="button"
                                class="small-action-button"
                                id="startChatBtn">

                                <i class="fa-solid fa-message"></i>

                                <span>Start Chat</span>

                            </button>
                        `
                        : ""
                }

            </div>

        `;


        const startButton =
            document.getElementById(
                "startChatBtn"
            );


        if (startButton) {

            startButton.addEventListener(
                "click",
                startNewConversation
            );

        }


        return;

    }


    filtered.forEach(
        function (conversation) {

            list.appendChild(
                createConversationElement(
                    conversation
                )
            );

        }
    );

}


/* =========================================================
   CREATE CONVERSATION ELEMENT
========================================================= */

function createConversationElement(
    conversation
) {

    const user =
        getUserById(
            conversation.otherUserId
        );


    const name =
        getUserName(
            user
        );


    const photo =
        getUserPhoto(
            user
        );


    const messages =
        conversation.messages;


    const lastMessage =
        messages[
            messages.length - 1
        ];


    const unreadCount =
        messages.filter(
            function (message) {

                return (
                    String(
                        message.receiverId
                    ) ===
                    String(
                        getCurrentUserId()
                    ) &&
                    message.read !== true
                );

            }
        ).length;


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "conversation-item";


    item.style.cssText = `

        display:flex;
        align-items:center;
        gap:10px;
        padding:11px 14px;
        cursor:pointer;
        border-bottom:1px solid #f1f3f5;
        transition:background .2s ease;

    `;


    if (
        conversation.id ===
        activeConversationId
    ) {

        item.style.background =
            "#f3f4f6";

    }


    item.innerHTML = `

        <div
            style="
                width:40px;
                height:40px;
                border-radius:50%;
                overflow:hidden;
                background:#f1f3f5;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-shrink:0;
                color:#9ca3af;
            ">

            <img
                src="${escapeAttribute(photo)}"
                alt="${escapeAttribute(name)}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                "
                onerror="this.src='images/default-profile.png';">

        </div>


        <div
            style="
                min-width:0;
                flex:1;
            ">

            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    gap:8px;
                ">

                <strong
                    style="
                        font-size:13px;
                        color:#374151;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                    ">

                    ${escapeHtml(name)}

                </strong>


                <small
                    style="
                        color:#9ca3af;
                        font-size:10px;
                        white-space:nowrap;
                    ">

                    ${formatMessageTime(
                        lastMessage.createdAt
                    )}

                </small>

            </div>


            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:8px;
                    margin-top:3px;
                ">

                <span
                    style="
                        color:#9ca3af;
                        font-size:11px;
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                    ">

                    ${
                        String(
                            lastMessage.senderId
                        ) ===
                        String(
                            getCurrentUserId()
                        )
                            ? "You: "
                            : ""
                    }

                    ${escapeHtml(
                        lastMessage.text || ""
                    )}

                </span>


                ${
                    unreadCount > 0
                        ? `
                            <b
                                style="
                                    min-width:18px;
                                    height:18px;
                                    padding:0 5px;
                                    border-radius:20px;
                                    background:#111827;
                                    color:white;
                                    font-size:10px;
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                ">

                                ${unreadCount}

                            </b>
                        `
                        : ""
                }

            </div>

        </div>

    `;


    item.addEventListener(
        "click",
        function () {

            openConversation(
                conversation.otherUserId
            );

        }
    );


    return item;

}


/* =========================================================
   OPEN CONVERSATION
========================================================= */

function openConversation(
    otherUserId
) {

    activeConversationId =
        getConversationId(
            getCurrentUserId(),
            otherUserId
        );


    markConversationAsRead(
        otherUserId
    );


    renderChat(
        otherUserId
    );


    renderConversations();


    const chatPanel =
        document.querySelector(
            ".chat-panel"
        );


    if (
        window.innerWidth <= 750 &&
        chatPanel
    ) {

        chatPanel.classList.add(
            "mobile-active"
        );

    }

}


/* =========================================================
   RENDER CHAT
========================================================= */

function renderChat(
    otherUserId
) {

    const user =
        getUserById(
            otherUserId
        );


    const name =
        getUserName(
            user
        );


    const photo =
        getUserPhoto(
            user
        );


    const headerName =
        document.getElementById(
            "chatUserName"
        );


    const headerStatus =
        document.getElementById(
            "chatUserStatus"
        );


    const headerPhoto =
        document.getElementById(
            "chatUserPhoto"
        );


    const composer =
        document.getElementById(
            "messageComposer"
        );


    if (headerName) {

        headerName.textContent =
            name;

    }


    if (headerStatus) {

        headerStatus.textContent =
            "Private conversation";

    }


    if (headerPhoto) {

        headerPhoto.innerHTML = `

            <img
                src="${escapeAttribute(photo)}"
                alt="${escapeAttribute(name)}"
                onerror="this.src='images/default-profile.png';">

        `;

    }


    if (composer) {

        composer.style.display =
            "flex";

    }


    renderMessages(
        otherUserId
    );

}


/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages(
    otherUserId
) {

    const list =
        document.getElementById(
            "messageList"
        );


    if (!list) {
        return;
    }


    const currentUserId =
        getCurrentUserId();


    const messages =
        getMessages().filter(
            function (message) {

                return (

                    (
                        String(
                            message.senderId
                        ) ===
                        String(
                            currentUserId
                        ) &&

                        String(
                            message.receiverId
                        ) ===
                        String(
                            otherUserId
                        )
                    )

                    ||

                    (
                        String(
                            message.senderId
                        ) ===
                        String(
                            otherUserId
                        ) &&

                        String(
                            message.receiverId
                        ) ===
                        String(
                            currentUserId
                        )
                    )

                );

            }
        );


    list.innerHTML =
        "";


    if (
        messages.length === 0
    ) {

        list.innerHTML = `

            <div class="no-chat-selected">

                <div class="empty-icon">

                    <i class="fa-regular fa-comment-dots"></i>

                </div>

                <h3>
                    Start the conversation
                </h3>

                <p>
                    Send your first message.
                </p>

            </div>

        `;

        return;

    }


    messages.sort(
        function (a, b) {

            return (
                new Date(
                    a.createdAt
                ) -
                new Date(
                    b.createdAt
                )
            );

        }
    );


    messages.forEach(
        function (message) {

            list.appendChild(
                createMessageElement(
                    message
                )
            );

        }
    );


    requestAnimationFrame(
        function () {

            list.scrollTop =
                list.scrollHeight;

        }
    );

}


/* =========================================================
   CREATE MESSAGE ELEMENT
========================================================= */

function createMessageElement(
    message
) {

    const mine =
        String(
            message.senderId
        ) ===
        String(
            getCurrentUserId()
        );


    const wrapper =
        document.createElement(
            "div"
        );


    wrapper.style.cssText = `

        display:flex;
        justify-content:${mine ? "flex-end" : "flex-start"};
        margin-bottom:8px;

    `;


    const bubble =
        document.createElement(
            "div"
        );


    bubble.style.cssText = `

        max-width:75%;
        padding:8px 11px;
        border-radius:12px;
        background:${mine ? "#111827" : "#ffffff"};
        color:${mine ? "#ffffff" : "#374151"};
        border:${mine ? "none" : "1px solid #e5e7eb"};
        box-shadow:0 1px 2px rgba(0,0,0,.04);

    `;


    bubble.innerHTML = `

        <div
            style="
                font-size:13px;
                line-height:1.5;
                word-break:break-word;
            ">

            ${escapeHtml(
                message.text || ""
            )}

        </div>


        <div
            style="
                font-size:9px;
                margin-top:4px;
                opacity:.6;
                text-align:right;
            ">

            ${formatMessageTime(
                message.createdAt
            )}

        </div>

    `;


    wrapper.appendChild(
        bubble
    );


    return wrapper;

}


/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage() {

    if (!activeConversationId) {

        showMessage(
            "Select a conversation first."
        );

        return;

    }


    const input =
        document.getElementById(
            "messageInput"
        );


    if (!input) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {

        input.focus();

        return;

    }


    const parts =
        activeConversationId.split(
            "_"
        );


    const currentUserId =
        getCurrentUserId();


    const otherUserId =
        parts.find(
            function (id) {

                return String(id) !==
                    String(currentUserId);

            }
        );


    if (!otherUserId) {

        showMessage(
            "Could not find the recipient."
        );

        return;

    }


    const message = {

        id:
            "message-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2),

        conversationId:
            activeConversationId,

        senderId:
            currentUserId,

        receiverId:
            otherUserId,

        senderName:
            getCurrentUserName(),

        senderPhoto:
            getCurrentUserPhoto(),

        text:
            text,

        createdAt:
            new Date().toISOString(),

        read:
            false

    };


    const messages =
        getMessages();


    messages.push(
        message
    );


    if (
        !saveMessages(
            messages
        )
    ) {

        showMessage(
            "Could not send message."
        );

        return;

    }


    input.value =
        "";


    renderChat(
        otherUserId
    );


    renderConversations();


    createMessageNotification(
        message
    );

}


/* =========================================================
   MARK AS READ
========================================================= */

function markConversationAsRead(
    otherUserId
) {

    const currentUserId =
        getCurrentUserId();


    const messages =
        getMessages();


    let changed =
        false;


    messages.forEach(
        function (message) {

            if (

                String(
                    message.senderId
                ) ===
                String(
                    otherUserId
                )

                &&

                String(
                    message.receiverId
                ) ===
                String(
                    currentUserId
                )

                &&

                message.read !== true

            ) {

                message.read =
                    true;

                changed =
                    true;

            }

        }
    );


    if (changed) {

        saveMessages(
            messages
        );

    }

}


/* =========================================================
   NEW CONVERSATION
========================================================= */

function startNewConversation() {

    const userId =
        window.prompt(
            "Enter the user ID you want to message:"
        );


    if (
        userId === null
    ) {

        return;

    }


    const cleanId =
        userId.trim();


    if (!cleanId) {

        showMessage(
            "Please enter a user ID."
        );

        return;

    }


    if (
        String(cleanId) ===
        String(getCurrentUserId())
    ) {

        showMessage(
            "You cannot message yourself."
        );

        return;

    }


    /*
     * We open the conversation even if
     * the user's profile is not yet available.
     * Later this will connect to the real
     * user search/profile system.
     */

    openConversation(
        cleanId
    );


    const input =
        document.getElementById(
            "messageInput"
        );


    if (input) {

        input.focus();

    }

}


/* =========================================================
   USER LOOKUP
========================================================= */

function getUserById(
    userId
) {

    const users =
        getStorageArray(
            "users"
        );


    const found =
        users.find(
            function (user) {

                return String(
                    user.id ||
                    user.userId ||
                    user.accountId ||
                    user.email ||
                    user.phone
                ) ===
                String(userId);

            }
        );


    if (found) {

        return found;

    }


    /*
     * If the real user database is not
     * available yet, return a temporary
     * user object.
     */

    return {

        id:
            userId,

        fullName:
            "Member",

        photo:
            "images/default-profile.png"

    };

}


/* =========================================================
   USER NAME
========================================================= */

function getUserName(
    user
) {

    if (!user) {

        return "Member";

    }


    return (
        user.fullName ||
        user.name ||
        user.displayName ||
        "Member"
    );

}


/* =========================================================
   USER PHOTO
========================================================= */

function getUserPhoto(
    user
) {

    if (!user) {

        return "images/default-profile.png";

    }


    return (
        user.photo ||
        user.profilePhoto ||
        (
            Array.isArray(
                user.photos
            )
                ? user.photos[0]
                : null
        ) ||
        "images/default-profile.png"
    );

}


/* =========================================================
   MESSAGE NOTIFICATION
========================================================= */

function createMessageNotification(
    message
) {

    /*
     * This connects the messaging system
     * with the notification system we created.
     */

    const notifications =
        getStorageArray(
            "ghanaConnectNotifications"
        );


    notifications.unshift({

        id:
            "notification-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2),

        type:
            "message",

        userId:
            String(
                message.receiverId
            ),

        fromUserId:
            String(
                message.senderId
            ),

        fromUserName:
            message.senderName,

        message:
            message.senderName +
            " sent you a message.",

        createdAt:
            message.createdAt,

        read:
            false

    });


    saveStorageArray(
        "ghanaConnectNotifications",
        notifications
    );

}


/* =========================================================
   MESSAGE TIME
========================================================= */

function formatMessageTime(
    dateString
) {

    if (!dateString) {

        return "";

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

        return "";

    }


    const now =
        Date.now();


    const difference =
        Math.floor(
            (
                now -
                date.getTime()
            ) / 1000
        );


    if (
        difference < 60
    ) {

        return "now";

    }


    if (
        difference < 3600
    ) {

        return (
            Math.floor(
                difference / 60
            ) +
            "m"
        );

    }


    if (
        difference < 86400
    ) {

        return (
            Math.floor(
                difference / 3600
            ) +
            "h"
        );

    }


    return date.toLocaleDateString(
        [],
        {
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    text
) {

    const message =
        document.getElementById(
            "pageMessage"
        );


    if (!message) {

        console.log(
            text
        );

        return;

    }


    message.textContent =
        text;


    message.style.display =
        "block";


    clearTimeout(
        showMessage.timer
    );


    showMessage.timer =
        setTimeout(
            function () {

                message.style.display =
                    "none";

            },
            2500
        );

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


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}