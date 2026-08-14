/* =========================================================
   GHANA CONNECT — PROFILE SETUP STEP 3
   FINAL PROFILE REVIEW & VERIFICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("stepThreeForm");

    const message = document.getElementById("message");

    const agreeRules = document.getElementById("agreeRules");
    const agreeTruth = document.getElementById("agreeTruth");

    const completion = document.getElementById("completion");
    const completionText = document.getElementById("completionText");

    const finishButton = form.querySelector('button[type="submit"]');


    /* =====================================================
       LOAD STEP 1 & STEP 2 DATA
    ===================================================== */

    function getStoredData() {

        let stepOne = {};
        let stepTwo = {};

        try {
            stepOne = JSON.parse(
                localStorage.getItem("ghanaConnectStep1")
            ) || {};
        } catch (error) {
            console.warn("Could not read Step 1 data.");
        }

        try {
            stepTwo = JSON.parse(
                localStorage.getItem("ghanaConnectStep2")
            ) || {};
        } catch (error) {
            console.warn("Could not read Step 2 data.");
        }

        return {
            ...stepOne,
            ...stepTwo
        };
    }


    /* =====================================================
       DISPLAY PROFILE SUMMARY
    ===================================================== */

    function loadProfileSummary() {

        const data = getStoredData();

        const reviewName =
            document.getElementById("reviewName");

        const reviewRegion =
            document.getElementById("reviewRegion");

        const reviewGoal =
            document.getElementById("reviewGoal");

        const reviewInterests =
            document.getElementById("reviewInterests");


        if (reviewName) {

            reviewName.textContent =
                data.fullName ||
                data.name ||
                "-";

        }


        if (reviewRegion) {

            reviewRegion.textContent =
                data.region ||
                data.preferredRegion ||
                "-";

        }


        if (reviewGoal) {

            reviewGoal.textContent =
                data.relationshipGoal ||
                data.goal ||
                "-";

        }


        if (reviewInterests) {

            let interests = data.interests;

            if (Array.isArray(interests)) {

                reviewInterests.textContent =
                    interests.length
                        ? interests.join(", ")
                        : "None selected";

            } else {

                reviewInterests.textContent =
                    interests ||
                    "None selected";

            }

        }

    }


    /* =====================================================
       PHOTO UPLOAD
    ===================================================== */

    const photoInputs = [
        {
            input: document.getElementById("photo1"),
            preview: document.getElementById("photo1Preview"),
            storageKey: "ghanaConnectPhoto1"
        },
        {
            input: document.getElementById("photo2"),
            preview: document.getElementById("photo2Preview"),
            storageKey: "ghanaConnectPhoto2"
        },
        {
            input: document.getElementById("photo3"),
            preview: document.getElementById("photo3Preview"),
            storageKey: "ghanaConnectPhoto3"
        }
    ];


    function handlePhotoUpload(item) {

        if (!item.input || !item.preview) {
            return;
        }


        item.input.addEventListener("change", () => {

            const file = item.input.files[0];

            if (!file) {
                return;
            }


            /* Validate image */

            if (!file.type.startsWith("image/")) {

                showMessage(
                    "Please select a valid image file.",
                    "error"
                );

                item.input.value = "";

                return;
            }


            /* Limit file size to 5 MB */

            const maxSize =
                5 * 1024 * 1024;

            if (file.size > maxSize) {

                showMessage(
                    "Each photo must be smaller than 5 MB.",
                    "error"
                );

                item.input.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload = event => {

                item.preview.src =
                    event.target.result;


                /*
                   Store the preview temporarily.

                   Note:
                   Base64 images are suitable for a prototype,
                   but production apps should upload images
                   to secure server/cloud storage instead.
                */

                try {

                    localStorage.setItem(
                        item.storageKey,
                        event.target.result
                    );

                } catch (error) {

                    console.warn(
                        "Photo could not be stored locally."
                    );

                }


                updateCompletion();

            };


            reader.readAsDataURL(file);

        });

    }


    photoInputs.forEach(handlePhotoUpload);


    /* =====================================================
       RESTORE PREVIOUSLY SELECTED PHOTOS
    ===================================================== */

    function restorePhotos() {

        photoInputs.forEach(item => {

            if (!item.preview) {
                return;
            }

            try {

                const saved =
                    localStorage.getItem(
                        item.storageKey
                    );

                if (saved) {

                    item.preview.src = saved;

                }

            } catch (error) {

                console.warn(
                    "Could not restore saved photo."
                );

            }

        });

    }


    /* =====================================================
       COMPLETION CALCULATION
    ===================================================== */

    function updateCompletion() {

        let completed = 0;
        let total = 5;


        /* Photo 1 */

        if (
            photoInputs[0]?.input?.files?.length ||
            localStorage.getItem("ghanaConnectPhoto1")
        ) {

            completed++;

        }


        /* Photo 2 */

        if (
            photoInputs[1]?.input?.files?.length ||
            localStorage.getItem("ghanaConnectPhoto2")
        ) {

            completed++;

        }


        /* Photo 3 */

        if (
            photoInputs[2]?.input?.files?.length ||
            localStorage.getItem("ghanaConnectPhoto3")
        ) {

            completed++;

        }


        /* Safety rules */

        if (agreeRules.checked) {
            completed++;
        }


        /* Information confirmation */

        if (agreeTruth.checked) {
            completed++;
        }


        const percentage =
            Math.round(
                (completed / total) * 100
            );


        completion.style.width =
            `${percentage}%`;


        completionText.textContent =
            `${percentage}%`;


        /*
           Button remains available so users can finish
           without uploading every optional photo.
        */

    }


    /* =====================================================
       CHECKBOX EVENTS
    ===================================================== */

    agreeRules.addEventListener(
        "change",
        updateCompletion
    );


    agreeTruth.addEventListener(
        "change",
        updateCompletion
    );


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(text, type) {

        message.textContent = text;

        message.className = type;


        /*
           Clear message automatically.
        */

        setTimeout(() => {

            if (message.textContent === text) {

                message.textContent = "";
                message.className = "";

            }

        }, 4000);

    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    form.addEventListener("submit", event => {

        event.preventDefault();


        /* Require safety agreement */

        if (!agreeRules.checked) {

            showMessage(
                "Please agree to the Ghana Connect safety rules before continuing.",
                "error"
            );

            agreeRules.focus();

            return;
        }


        /* Require information confirmation */

        if (!agreeTruth.checked) {

            showMessage(
                "Please confirm that your information is correct.",
                "error"
            );

            agreeTruth.focus();

            return;
        }


        /* Prevent duplicate submission */

        finishButton.disabled = true;

        finishButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Creating Profile...';


        /* Collect final profile data */

        const profileData = getStoredData();


        profileData.profileCompleted = true;

        profileData.completedAt =
            new Date().toISOString();


        profileData.safetyRulesAccepted = true;

        profileData.informationConfirmed = true;


        /* Count uploaded photos */

        profileData.photoCount = photoInputs.filter(
            item =>
                item.input?.files?.length ||
                localStorage.getItem(item.storageKey)
        ).length;


        try {

            localStorage.setItem(
                "ghanaConnectProfile",
                JSON.stringify(profileData)
            );

        } catch (error) {

            console.error(
                "Could not save profile:",
                error
            );

            finishButton.disabled = false;

            finishButton.innerHTML =
                'Finish Profile <i class="fa-solid fa-check"></i>';

            showMessage(
                "Something went wrong while saving your profile.",
                "error"
            );

            return;
        }


        /* Success */

        showMessage(
            "Profile completed successfully!",
            "success"
        );


        /*
           Give the success message a moment before
           moving to the profile/dashboard page.
        */

        setTimeout(() => {

            window.location.href =
                "profile.html";

        }, 1200);

    });


    /* =====================================================
       LOAD PAGE
    ===================================================== */

    loadProfileSummary();

    restorePhotos();

    updateCompletion();

});