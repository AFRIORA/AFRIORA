/* =========================================================
   GHANA CONNECT POSTS
   POSTS JAVASCRIPT

   Features:
   - Create posts
   - Photo uploads
   - Video uploads
   - Persistent media
   - Edit
   - Delete
   - Like
   - Comment
   - Share
   - Save
   - Report
   - Post menu
   - Outside-menu closing
   - Owner protection
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const POSTS_STORAGE_KEY =
    "ghanaConnectPosts";



/* =========================================================
   NOTIFICATIONS
========================================================= */

const NOTIFICATIONS_STORAGE_KEY =
    "ghanaConnectNotifications";


/* =========================================================
   GET NOTIFICATIONS
========================================================= */

function getNotifications() {

    return getStorageArray(
        NOTIFICATIONS_STORAGE_KEY
    );

}


/* =========================================================
   SAVE NOTIFICATIONS
========================================================= */

function saveNotifications(
    notifications
) {

    return saveStorageArray(
        NOTIFICATIONS_STORAGE_KEY,
        notifications
    );

}


/* =========================================================
   CREATE NOTIFICATION
========================================================= */

function createNotification({

    recipientId,
    senderId,
    senderName,
    type,
    message,
    postId = null

}) {

    /*
     * Do not notify someone about
     * their own action.
     */

    if (
        String(recipientId) ===
        String(senderId)
    ) {

        return false;

    }


    if (
        !recipientId ||
        !senderId ||
        !type ||
        !message
    ) {

        return false;

    }


    const notifications =
        getNotifications();


    /*
     * Prevent accidental duplicate
     * notifications.
     */

    const duplicate =
        notifications.find(
            function (notification) {

                return (

                    String(
                        notification.recipientId
                    ) ===
                    String(recipientId)

                    &&

                    String(
                        notification.senderId
                    ) ===
                    String(senderId)

                    &&

                    notification.type ===
                    type

                    &&

                    String(
                        notification.postId
                    ) ===
                    String(postId)

                );

            }
        );


    if (duplicate) {

        return false;

    }


    const notification = {

        id:
            "notification-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2),

        recipientId:
            String(recipientId),

        senderId:
            String(senderId),

        senderName:
            senderName ||
            "Member",

        type:
            type,

        message:
            message,

        postId:
            postId,

        createdAt:
            new Date().toISOString(),

        read:
            false

    };


    notifications.unshift(
        notification
    );


    /*
     * Keep newest notifications
     * first and limit storage.
     */

    const limitedNotifications =
        notifications.slice(
            0,
            100
        );


    return saveNotifications(
        limitedNotifications
    );

}


/* =========================================================
   UNREAD NOTIFICATION COUNT
========================================================= */

function getUnreadNotificationCount() {

    const currentUserId =
        getCurrentUserId();


    const notifications =
        getNotifications();


    return notifications.filter(
        function (notification) {

            return (

                String(
                    notification.recipientId
                ) ===
                String(currentUserId)

                &&

                notification.read ===
                false

            );

        }
    ).length;

}

/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;

let userProfile = null;

let selectedMedia = null;


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCurrentUser();

        initializePostCreation();

        initializeMediaButtons();

        initializeBackButton();

        initializeOutsideMenuClose();

        renderPosts();

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


    const fullName =
        getCurrentUserName();


    const firstName =
        fullName
            .trim()
            .split(/\s+/)[0] ||
            "Member";


    const photo =
        getCurrentUserPhoto();


    const photoElement =
        document.getElementById(
            "currentUserPhoto"
        );


    if (photoElement) {

        photoElement.src =
            photo;

        photoElement.onerror =
            function () {

                this.src =
                    "images/default-profile.png";

            };

    }


    const topUserName =
        document.getElementById(
            "topUserName"
        );


    if (topUserName) {

        topUserName.textContent =
            firstName;

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
            userProfile.photos.length > 0
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
        currentUser.ghanaCard ||
        currentUser.email ||
        currentUser.phone ||
        "member"

    ).trim();

}


/* =========================================================
   BACK BUTTON
========================================================= */

function initializeBackButton() {

    const backButton =
        document.getElementById(
            "backToDiscover"
        );


    if (!backButton) {

        return;

    }


    backButton.href =
        "discover.html";


    backButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.assign(
                "discover.html"
            );

        }
    );

}


/* =========================================================
   MEDIA BUTTONS
========================================================= */

function initializeMediaButtons() {

    const photoBtn =
        document.getElementById(
            "photoBtn"
        );

    const videoBtn =
        document.getElementById(
            "videoBtn"
        );

    const postImage =
        document.getElementById(
            "postImage"
        );

    const postVideo =
        document.getElementById(
            "postVideo"
        );

    const removeMedia =
        document.getElementById(
            "removeMedia"
        );


    if (
        photoBtn &&
        postImage
    ) {

        photoBtn.addEventListener(
            "click",
            function () {

                postImage.click();

            }
        );

    }


    if (
        videoBtn &&
        postVideo
    ) {

        videoBtn.addEventListener(
            "click",
            function () {

                postVideo.click();

            }
        );

    }


    if (postImage) {

        postImage.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];


                if (!file) {

                    return;

                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    showMessage(
                        "Please select an image file."
                    );

                    this.value =
                        "";

                    return;

                }


                showImagePreview(
                    file
                );

            }
        );

    }


    if (postVideo) {

        postVideo.addEventListener(
            "change",
            function () {

                const file =
                    this.files[0];


                if (!file) {

                    return;

                }


                if (
                    !file.type.startsWith(
                        "video/"
                    )
                ) {

                    showMessage(
                        "Please select a video file."
                    );

                    this.value =
                        "";

                    return;

                }


                showVideoPreview(
                    file
                );

            }
        );

    }


    if (removeMedia) {

        removeMedia.addEventListener(
            "click",
            function () {

                clearMedia();

            }
        );

    }

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function showImagePreview(file) {

    clearMedia(false);


    const imageURL =
        URL.createObjectURL(
            file
        );


    selectedMedia = {

        type:
            "image",

        file:
            file,

        url:
            imageURL

    };


    const preview =
        document.getElementById(
            "postPreview"
        );

    const image =
        document.getElementById(
            "imagePreview"
        );

    const video =
        document.getElementById(
            "videoPreview"
        );


    if (
        !preview ||
        !image ||
        !video
    ) {

        return;

    }


    image.src =
        imageURL;

    image.style.display =
        "block";

    video.style.display =
        "none";

    preview.style.display =
        "block";

}


/* =========================================================
   VIDEO PREVIEW
========================================================= */

function showVideoPreview(file) {

    clearMedia(false);


    const videoURL =
        URL.createObjectURL(
            file
        );


    selectedMedia = {

        type:
            "video",

        file:
            file,

        url:
            videoURL

    };


    const preview =
        document.getElementById(
            "postPreview"
        );

    const image =
        document.getElementById(
            "imagePreview"
        );

    const video =
        document.getElementById(
            "videoPreview"
        );


    if (
        !preview ||
        !image ||
        !video
    ) {

        return;

    }


    video.src =
        videoURL;

    video.style.display =
        "block";

    image.style.display =
        "none";

    preview.style.display =
        "block";

}


/* =========================================================
   CLEAR MEDIA
========================================================= */

function clearMedia(
    resetInput = true
) {

    if (
        selectedMedia &&
        selectedMedia.url &&
        selectedMedia.url.startsWith(
            "blob:"
        )
    ) {

        URL.revokeObjectURL(
            selectedMedia.url
        );

    }


    selectedMedia =
        null;


    const preview =
        document.getElementById(
            "postPreview"
        );

    const image =
        document.getElementById(
            "imagePreview"
        );

    const video =
        document.getElementById(
            "videoPreview"
        );


    if (image) {

        image.src =
            "";

        image.style.display =
            "none";

    }


    if (video) {

        video.pause();

        video.src =
            "";

        video.style.display =
            "none";

    }


    if (preview) {

        preview.style.display =
            "none";

    }


    if (resetInput) {

        const postImage =
            document.getElementById(
                "postImage"
            );

        const postVideo =
            document.getElementById(
                "postVideo"
            );


        if (postImage) {

            postImage.value =
                "";

        }


        if (postVideo) {

            postVideo.value =
                "";

        }

    }

}


/* =========================================================
   FILE TO DATA URL
========================================================= */

function fileToDataURL(file) {

    return new Promise(
        function (
            resolve,
            reject
        ) {

            const reader =
                new FileReader();


            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not read file."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================================
   POST CREATION
========================================================= */

function initializePostCreation() {

    const publishButton =
        document.getElementById(
            "publishBtn"
        );

    const input =
        document.getElementById(
            "postInput"
        );


    if (publishButton) {

        publishButton.addEventListener(
            "click",
            createPost
        );

    }


    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    createPost();

                }

            }
        );

    }

}


/* =========================================================
   CREATE POST
========================================================= */

async function createPost() {

    const input =
        document.getElementById(
            "postInput"
        );


    if (!input) {

        return;

    }


    const caption =
        input.value.trim();


    if (
        !caption &&
        !selectedMedia
    ) {

        showMessage(
            "Write something or add a photo/video."
        );

        input.focus();

        return;

    }


    const publishButton =
        document.getElementById(
            "publishBtn"
        );


    if (publishButton) {

        publishButton.disabled =
            true;

        publishButton.style.opacity =
            "0.6";

    }


    try {

        let mediaData =
            null;


        if (
            selectedMedia &&
            selectedMedia.file
        ) {

            mediaData =
                await fileToDataURL(
                    selectedMedia.file
                );

        }


        const post = {

            id:
                "post-" +
                Date.now() +
                "-" +
                Math.random()
                    .toString(36)
                    .slice(2),

            userId:
                getCurrentUserId(),

            userName:
                getCurrentUserName(),

            userPhoto:
                getCurrentUserPhoto(),

            caption:
                caption,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                null,

            edited:
                false,

            likes:
                [],

            saves:
                [],

            reports:
                [],

            comments:
                [],

            mediaType:
                selectedMedia
                    ? selectedMedia.type
                    : null,

            mediaUrl:
                mediaData

        };


        const posts =
            getStorageArray(
                POSTS_STORAGE_KEY
            );


        posts.unshift(
            post
        );


        if (
            !saveStorageArray(
                POSTS_STORAGE_KEY,
                posts
            )
        ) {

            throw new Error(
                "Storage failed"
            );

        }


        input.value =
            "";


        clearMedia();


        renderPosts();


        showMessage(
            "Post published successfully."
        );

    } catch (error) {

        console.error(
            "Create post error:",
            error
        );


        showMessage(
            "Could not save the post. The selected media may be too large."
        );

    } finally {

        if (publishButton) {

            publishButton.disabled =
                false;

            publishButton.style.opacity =
                "1";

        }

    }

}


/* =========================================================
   RENDER POSTS
========================================================= */

function renderPosts() {

    const postsList =
        document.getElementById(
            "postsList"
        );


    if (!postsList) {

        return;

    }


    const posts =
        getStorageArray(
            POSTS_STORAGE_KEY
        );


    postsList.innerHTML =
        "";


    if (posts.length === 0) {

        postsList.innerHTML = `

            <div class="empty-state">

                <i class="fa-solid fa-comments"></i>

                <h3>No posts yet</h3>

                <p>
                    Be the first person to share
                    something with Ghana Connect.
                </p>

            </div>

        `;

        return;

    }


    posts.forEach(
        function (post) {

            postsList.appendChild(
                createPostElement(
                    post
                )
            );

        }
    );

}


/* =========================================================
   CREATE POST ELEMENT
========================================================= */

function createPostElement(post) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "post-card";


    const userPhoto =
        escapeAttribute(
            post.userPhoto ||
            "images/default-profile.png"
        );


    const userName =
        escapeHtml(
            post.userName ||
            "Member"
        );


    const caption =
        escapeHtml(
            post.caption ||
            ""
        );


    const time =
        formatPostTime(
            post.createdAt
        );


    const likes =
        Array.isArray(post.likes)
            ? post.likes
            : [];


    const saves =
        Array.isArray(post.saves)
            ? post.saves
            : [];


    const reports =
        Array.isArray(post.reports)
            ? post.reports
            : [];


    const comments =
        Array.isArray(post.comments)
            ? post.comments
            : [];


    const currentUserId =
        getCurrentUserId();


    const isOwner =
        String(post.userId) ===
        String(currentUserId);


    const liked =
        likes.includes(
            currentUserId
        );


    const saved =
        saves.includes(
            currentUserId
        );


    const reported =
        reports.includes(
            currentUserId
        );


    card.innerHTML = `

        <!-- ================================================
             POST HEADER
        ================================================= -->

        <div class="post-header">

            <img
                src="${userPhoto}"
                alt="${userName}"
                onerror="this.src='images/default-profile.png'">


            <div>

                <h3>
                    ${userName}
                </h3>

                <p>

                    ${time}

                    ${
                        post.edited
                            ? " · Edited"
                            : ""
                    }

                </p>

            </div>


            <!-- ============================================
                 THREE DOT POST MENU
            ============================================= -->

            <div class="post-menu-wrapper">

                <button
                    type="button"
                    class="post-menu-button"
                    data-action="toggle-menu"
                    data-post-id="${escapeAttribute(post.id)}"
                    aria-label="Post menu">

                    <i class="fa-solid fa-ellipsis-vertical"></i>

                </button>


                <div
                    class="post-menu"
                    data-menu="${escapeAttribute(post.id)}">


                    ${
                        isOwner

                        ? `

                            <button
                                type="button"
                                data-action="edit"
                                data-post-id="${escapeAttribute(post.id)}">

                                <i class="fa-solid fa-pen"></i>

                                <span>Edit</span>

                            </button>


                            <button
                                type="button"
                                class="delete-option"
                                data-action="delete"
                                data-post-id="${escapeAttribute(post.id)}">

                                <i class="fa-solid fa-trash"></i>

                                <span>Delete</span>

                            </button>

                        `

                        : ""

                    }


                    <!-- REPORT IS ALWAYS IN THE MENU -->

                    <button
                        type="button"
                        class="${reported ? "reported-option" : ""}"
                        data-action="report"
                        data-post-id="${escapeAttribute(post.id)}">

                        <i class="fa-solid fa-flag"></i>

                        <span>
                            ${
                                reported
                                    ? "Reported"
                                    : "Report"
                            }
                        </span>

                    </button>

                </div>

            </div>

        </div>


        <!-- ================================================
             POST CONTENT
        ================================================= -->

        <div class="post-content">

            ${
                caption
                    ? `<p>${caption}</p>`
                    : ""
            }

            ${createMediaHtml(post)}

        </div>


        <!-- ================================================
             POST STATS
        ================================================= -->

        <div class="post-stats">

            <span>

                ❤️

                <strong>
                    ${likes.length}
                </strong>

                Likes

            </span>


            <span>

                💬

                <strong>
                    ${comments.length}
                </strong>

                Comments

            </span>

        </div>


        <!-- ================================================
             POST ACTIONS

             EXACT ARRANGEMENT:
             LIKE → COMMENT → SHARE → SAVE
        ================================================= -->

        <div class="post-actions">


            <!-- LIKE -->

            <button
                type="button"
                class="like-button ${liked ? "active" : ""}"
                data-action="like"
                data-post-id="${escapeAttribute(post.id)}">

                <i class="fa-regular fa-heart"></i>

                <span>
                    Like
                </span>

            </button>


            <!-- COMMENT -->

            <button
                type="button"
                data-action="focus-comment"
                data-post-id="${escapeAttribute(post.id)}">

                <i class="fa-regular fa-comment"></i>

                <span>
                    Comment
                </span>

            </button>


            <!-- SHARE -->

            <button
                type="button"
                class="share-button"
                data-action="share"
                data-post-id="${escapeAttribute(post.id)}">

                <i class="fa-solid fa-share"></i>

                <span>
                    Share
                </span>

            </button>


            <!-- SAVE -->

            <button
                type="button"
                class="${saved ? "active" : ""}"
                data-action="save"
                data-post-id="${escapeAttribute(post.id)}">

                <i class="fa-regular fa-bookmark"></i>

                <span>
                    ${saved ? "Saved" : "Save"}
                </span>

            </button>

        </div>


        <!-- ================================================
             COMMENT BOX
        ================================================= -->

        <div class="comment-box">

            <input
                type="text"
                maxlength="500"
                placeholder="Write a comment..."
                data-comment-input="${escapeAttribute(post.id)}">


            <button
                type="button"
                data-action="comment"
                data-post-id="${escapeAttribute(post.id)}">

                Send

            </button>

        </div>


        <!-- ================================================
             COMMENTS
        ================================================= -->

        <div
            class="comments-list"
            data-comments="${escapeAttribute(post.id)}">

            ${createCommentsHtml(comments)}

        </div>

    `;


    attachPostEvents(
        card,
        post.id
    );


    return card;

}


/* =========================================================
   MEDIA HTML
========================================================= */

function createMediaHtml(post) {

    if (
        !post.mediaUrl ||
        !post.mediaType
    ) {

        return "";

    }


    if (
        typeof post.mediaUrl === "string" &&
        post.mediaUrl.startsWith(
            "blob:"
        )
    ) {

        return "";

    }


    const safeUrl =
        escapeAttribute(
            post.mediaUrl
        );


    if (
        post.mediaType === "image"
    ) {

        return `

            <img
                class="post-media"
                src="${safeUrl}"
                alt="Post image"
                loading="lazy"
                onerror="this.style.display='none';">

        `;

    }


    if (
        post.mediaType === "video"
    ) {

        return `

            <video
                class="post-media"
                controls
                preload="metadata"
                src="${safeUrl}">
            </video>

        `;

    }


    return "";

}


/* =========================================================
   COMMENTS HTML
========================================================= */

function createCommentsHtml(
    comments
) {

    if (
        !Array.isArray(comments) ||
        comments.length === 0
    ) {

        return "";

    }


    return comments
        .map(
            function (comment) {

                return `

                    <div class="comment-item">

                        <div class="comment-author">

                            ${escapeHtml(
                                comment.userName ||
                                "Member"
                            )}

                        </div>

                        <div class="comment-text">

                            ${escapeHtml(
                                comment.text ||
                                ""
                            )}

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   POST EVENTS
========================================================= */

function attachPostEvents(
    card,
    postId
) {

    const buttons =
        card.querySelectorAll(
            "[data-action]"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();


                    const action =
                        this.dataset.action;


                    /* =====================================
                       MENU
                    ===================================== */

                    if (
                        action ===
                        "toggle-menu"
                    ) {

                        const menu =
                            card.querySelector(
                                `[data-menu="${postId}"]`
                            );


                        if (!menu) {

                            return;

                        }


                        document
                            .querySelectorAll(
                                ".post-menu.show"
                            )
                            .forEach(
                                function (
                                    otherMenu
                                ) {

                                    if (
                                        otherMenu !==
                                        menu
                                    ) {

                                        otherMenu.classList
                                            .remove(
                                                "show"
                                            );

                                    }

                                }
                            );


                        menu.classList.toggle(
                            "show"
                        );


                        return;

                    }


                    /* =====================================
                       EDIT
                    ===================================== */

                    if (
                        action ===
                        "edit"
                    ) {

                        closeAllPostMenus();

                        editPost(
                            postId
                        );

                        return;

                    }


                    /* =====================================
                       DELETE
                    ===================================== */

                    if (
                        action ===
                        "delete"
                    ) {

                        closeAllPostMenus();

                        deletePost(
                            postId
                        );

                        return;

                    }


                    /* =====================================
                       LIKE
                    ===================================== */

                    if (
                        action ===
                        "like"
                    ) {

                        toggleLike(
                            postId
                        );

                        return;

                    }


                    /* =====================================
                       COMMENT FOCUS
                    ===================================== */

                    if (
                        action ===
                        "focus-comment"
                    ) {

                        const input =
                            card.querySelector(
                                `[data-comment-input="${postId}"]`
                            );


                        if (input) {

                            input.focus();

                        }


                        return;

                    }


                    /* =====================================
                       COMMENT
                    ===================================== */

                    if (
                        action ===
                        "comment"
                    ) {

                        addComment(
                            postId
                        );

                        return;

                    }


                    /* =====================================
                       SAVE
                    ===================================== */

                    if (
                        action ===
                        "save"
                    ) {

                        toggleSave(
                            postId
                        );

                        return;

                    }


                    /* =====================================
                       SHARE
                    ===================================== */

                    if (
                        action ===
                        "share"
                    ) {

                        sharePost(
                            postId
                        );

                        return;

                    }


                    /* =====================================
                       REPORT

                       REPORT ONLY APPEARS IN THE
                       THREE-DOT POST MENU.
                    ===================================== */

                    if (
                        action ===
                        "report"
                    ) {

                        closeAllPostMenus();

                        reportPost(
                            postId
                        );

                        return;

                    }

                }
            )
        }
    );


    /* ================================================
       COMMENT ENTER KEY
    ================================================= */

    const input =
        card.querySelector(
            `[data-comment-input="${postId}"]`
        );


    if (input) {

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();

                    addComment(
                        postId
                    );

                }

            }
        );

    }

}


/* =========================================================
   CLOSE ALL MENUS
========================================================= */

function closeAllPostMenus() {

    document
        .querySelectorAll(
            ".post-menu.show"
        )
        .forEach(
            function (menu) {

                menu.classList.remove(
                    "show"
                );

            }
        );

}


/* =========================================================
   OUTSIDE MENU CLOSE
========================================================= */

function initializeOutsideMenuClose() {

    document.addEventListener(
        "click",
        function () {

            closeAllPostMenus();

        }
    );

}


/* =========================================================
   FIND POST
========================================================= */

function findPost(postId) {

    const posts =
        getStorageArray(
            POSTS_STORAGE_KEY
        );


    return (
        posts.find(
            function (post) {

                return String(post.id) ===
                    String(postId);

            }
        ) || null
    );

}


/* =========================================================
   UPDATE POST
========================================================= */

function updatePost(
    updatedPost
) {

    if (!updatedPost) {

        return false;

    }


    const posts =
        getStorageArray(
            POSTS_STORAGE_KEY
        );


    const index =
        posts.findIndex(
            function (post) {

                return String(post.id) ===
                    String(updatedPost.id);

            }
        );


    if (index === -1) {

        return false;

    }


    posts[index] =
        updatedPost;


    return saveStorageArray(
        POSTS_STORAGE_KEY,
        posts
    );

}


/* =========================================================
   EDIT POST
========================================================= */

function editPost(postId) {

    const post =
        findPost(
            postId
        );


    if (!post) {

        showMessage(
            "Post not found."
        );

        return;

    }


    const currentUserId =
        String(
            getCurrentUserId()
        );


    const postOwnerId =
        String(
            post.userId || ""
        );


    if (
        postOwnerId !==
        currentUserId
    ) {

        showMessage(
            "You can only edit your own posts."
        );

        return;

    }


    const newCaption =
        window.prompt(
            "Edit your post:",
            post.caption || ""
        );


    if (
        newCaption === null
    ) {

        return;

    }


    const updatedCaption =
        newCaption.trim();


    if (
        !updatedCaption &&
        !post.mediaUrl
    ) {

        showMessage(
            "Your post cannot be empty."
        );

        return;

    }


    post.caption =
        updatedCaption;


    post.updatedAt =
        new Date().toISOString();


    post.edited =
        true;


    if (
        !updatePost(post)
    ) {

        showMessage(
            "Could not update the post."
        );

        return;

    }


    renderPosts();


    showMessage(
        "Post updated successfully."
    );

}


/* =========================================================
   DELETE POST
========================================================= */

function deletePost(postId) {

    const post =
        findPost(
            postId
        );


    if (!post) {

        showMessage(
            "Post not found."
        );

        return;

    }


    const currentUserId =
        String(
            getCurrentUserId()
        );


    const postOwnerId =
        String(
            post.userId || ""
        );


    if (
        postOwnerId !==
        currentUserId
    ) {

        showMessage(
            "You can only delete your own posts."
        );

        return;

    }


    const confirmed =
        window.confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmed) {

        return;

    }


    const posts =
        getStorageArray(
            POSTS_STORAGE_KEY
        );


    const updatedPosts =
        posts.filter(
            function (item) {

                return String(item.id) !==
                    String(postId);

            }
        );


    if (
        updatedPosts.length ===
        posts.length
    ) {

        showMessage(
            "Could not find the post to delete."
        );

        return;

    }


    if (
        !saveStorageArray(
            POSTS_STORAGE_KEY,
            updatedPosts
        )
    ) {

        showMessage(
            "Could not delete the post."
        );

        return;

    }


    renderPosts();


    showMessage(
        "Post deleted successfully."
    );

}


/* =========================================================
   LIKE
========================================================= */

function toggleLike(postId) {

    const post =
        findPost(
            postId
        );


    if (!post) {
        return;
    }


    if (
        !Array.isArray(
            post.likes
        )
    ) {

        post.likes =
            [];

    }


    const userId =
        getCurrentUserId();


    const userName =
        getCurrentUserName();


    const index =
        post.likes.indexOf(
            userId
        );


    /* =========================================
       LIKE
    ========================================= */

    if (index === -1) {

        post.likes.push(
            userId
        );


        /*
         * Create notification for
         * the owner of the post.
         *
         * createNotification()
         * automatically prevents
         * self-notifications.
         */

        createNotification({

            recipientId:
                post.userId,

            senderId:
                userId,

            senderName:
                userName,

            type:
                "like",

            message:
                "liked your post",

            postId:
                post.id

        });

    }


    /* =========================================
       UNLIKE
    ========================================= */

    else {

        post.likes.splice(
            index,
            1
        );

    }


    /* =========================================
       SAVE POST
    ========================================= */

    updatePost(
        post
    );


    /* =========================================
       REFRESH POSTS
    ========================================= */

    renderPosts();

}

if (index === -1) {

    post.likes.push(userId);

    // Create notification for the post owner
    if (
        String(post.userId) !==
        String(userId)
    ) {

createNotification({

    recipientId:
        post.userId,

    senderId:
        userId,

    senderName:
        getCurrentUserName(),

    type:
        "like",

    message:
        "liked your post",

    postId:
        post.id

});        



    }

} else {

    post.likes.splice(
        index,
        1
    );

}

/* =========================================================
   SAVE
========================================================= */

function toggleSave(postId) {

    const post =
        findPost(
            postId
        );


    if (!post) {

        return;

    }


    if (
        !Array.isArray(
            post.saves
        )
    ) {

        post.saves =
            [];

    }


    const userId =
        getCurrentUserId();


    const index =
        post.saves.indexOf(
            userId
        );


    if (index === -1) {

        post.saves.push(
            userId
        );


        showMessage(
            "Post saved."
        );

    } else {

        post.saves.splice(
            index,
            1
        );


        showMessage(
            "Post removed from saved posts."
        );

    }


    updatePost(
        post
    );


    renderPosts();

}


/* =========================================================
   SHARE
========================================================= */

async function sharePost(postId) {

    const post =
        findPost(
            postId
        );


    if (!post) {

        showMessage(
            "Post not found."
        );

        return;

    }


    const shareText =
        post.caption
            ? post.caption
            : "Check out this post on Ghana Connect.";


    if (
        navigator.share
    ) {

        try {

            await navigator.share({

                title:
                    "Ghana Connect",

                text:
                    shareText

            });


            return;

        } catch (error) {

            if (
                error.name ===
                "AbortError"
            ) {

                return;

            }

        }

    }


    if (
        navigator.clipboard
    ) {

        try {

            await navigator.clipboard.writeText(
                shareText
            );


            showMessage(
                "Post text copied. You can share it anywhere."
            );


            return;

        } catch (error) {

            console.error(
                "Clipboard error:",
                error
            );

        }

    }


    showMessage(
        "Sharing is not available on this browser."
    );

}


/* =========================================================
   REPORT
========================================================= */

function reportPost(postId) {

    const post =
        findPost(
            postId
        );


    if (!post) {

        return;

    }


    /*
     * You cannot report your own post.
     * The Report option is still visible in
     * the post menu.
     */

    if (
        String(post.userId) ===
        String(getCurrentUserId())
    ) {

        showMessage(
            "You cannot report your own post."
        );

        return;

    }


    if (
        !Array.isArray(
            post.reports
        )
    ) {

        post.reports =
            [];

    }


    const userId =
        getCurrentUserId();


    if (
        post.reports.includes(
            userId
        )
    ) {

        showMessage(
            "You have already reported this post."
        );

        return;

    }


    const confirmed =
        window.confirm(
            "Report this post to Ghana Connect?"
        );


    if (!confirmed) {

        return;

    }


    post.reports.push(
        userId
    );


    if (
        !updatePost(post)
    ) {

        showMessage(
            "Could not report the post."
        );

        return;

    }


    renderPosts();


    showMessage(
        "Post reported."
    );

}


/* =========================================================
   ADD COMMENT
========================================================= */


function addComment(postId) {

    const post =
        findPost(
            postId
        );


    if (!post) {
        return;
    }


    const input =
        document.querySelector(
            `[data-comment-input="${postId}"]`
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


    if (
        !Array.isArray(
            post.comments
        )
    ) {

        post.comments =
            [];

    }


    const userId =
        getCurrentUserId();


    const userName =
        getCurrentUserName();


    /* =========================================
       CREATE COMMENT
    ========================================= */

    const comment = {

        id:
            "comment-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2),

        userId:
            userId,

        userName:
            userName,

        text:
            text,

        createdAt:
            new Date().toISOString()

    };


    post.comments.push(
        comment
    );


    /* =========================================
       CREATE NOTIFICATION
    ========================================= */

    createNotification({

        recipientId:
            post.userId,

        senderId:
            userId,

        senderName:
            userName,

        type:
            "comment",

        message:
            "commented on your post",

        postId:
            post.id

    });


    /* =========================================
       SAVE POST
    ========================================= */

    if (
        !updatePost(
            post
        )
    ) {

        showMessage(
            "Could not save comment."
        );

        return;

    }


    /* =========================================
       CLEAR INPUT
    ========================================= */

    input.value =
        "";


    /* =========================================
       REFRESH POSTS
    ========================================= */

    renderPosts();


    showMessage(
        "Comment added."
    );

}


/* =========================================================
   TIME FORMAT
========================================================= */

function formatPostTime(
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

function escapeHtml(value) {

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


function escapeAttribute(value) {

    return escapeHtml(
        value
    );

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(text) {

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