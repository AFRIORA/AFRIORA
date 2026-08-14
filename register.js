/* =========================================================
   AFRIORA — REGISTER SYSTEM
   ---------------------------------------------------------
   FLOW:

   Register
      ↓
   Supabase Auth account creation
      ↓
   Supabase sends email OTP
      ↓
   otp.html
      ↓
   Verify OTP
      ↓
   Save profile
      ↓
   Continue to profile/dashboard

   IMPORTANT:
   - No verification.html is required.
   - Password is handled by Supabase Auth.
   - Password is NEVER stored in sessionStorage.
   - Identity number is NOT stored in sessionStorage.
   - Never use the Supabase service-role/secret key here.
   - This file uses the publishable/anon client key only.
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const AFRIORA_SUPABASE_URL =
    "https://icmoskjyhldsqcyxhxui.supabase.co";

const AFRIORA_SUPABASE_KEY =
    "sb_publishable_XkxCTZol2qYOWgicCuv8YQ_fjtym_vO";

const OTP_PAGE = "otp.html";


/* =========================================================
   CHECK SUPABASE LIBRARY
========================================================= */

if (
    !window.supabase ||
    typeof window.supabase.createClient !== "function"
) {
    console.error(
        "AFRIORA: Supabase JavaScript library was not loaded."
    );

    alert(
        "AFRIORA could not load Supabase. Make sure the Supabase CDN script is loaded before register.js."
    );

    throw new Error(
        "Supabase JavaScript library is missing."
    );
}


/* =========================================================
   CREATE SUPABASE CLIENT
========================================================= */

const AFRIORA_CLIENT =
    window.supabase.createClient(
        AFRIORA_SUPABASE_URL,
        AFRIORA_SUPABASE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


window.AFRIORA_SUPABASE =
    AFRIORA_CLIENT;


/* =========================================================
   COUNTRY DATABASE
========================================================= */

const countries = [

    {
        code: "GH",
        name: "Ghana",
        flag: "🇬🇭",
        phoneCode: "+233",
        identity: "Ghana Card Number",
        placeholder: "GHA-XXXXXXXXX-X"
    },

    {
        code: "NG",
        name: "Nigeria",
        flag: "🇳🇬",
        phoneCode: "+234",
        identity: "National Identification Number (NIN)",
        placeholder: "Enter your 11-digit NIN"
    },

    {
        code: "KE",
        name: "Kenya",
        flag: "🇰🇪",
        phoneCode: "+254",
        identity: "National ID Number",
        placeholder: "Enter your National ID number"
    },

    {
        code: "ZA",
        name: "South Africa",
        flag: "🇿🇦",
        phoneCode: "+27",
        identity: "South African ID Number",
        placeholder: "Enter your ID number"
    },

    {
        code: "CI",
        name: "Côte d'Ivoire",
        flag: "🇨🇮",
        phoneCode: "+225",
        identity: "National Identity Card Number",
        placeholder: "Enter your identity number"
    },

    {
        code: "SN",
        name: "Senegal",
        flag: "🇸🇳",
        phoneCode: "+221",
        identity: "National Identity Card Number",
        placeholder: "Enter your identity number"
    },

    {
        code: "ET",
        name: "Ethiopia",
        flag: "🇪🇹",
        phoneCode: "+251",
        identity: "National ID Number",
        placeholder: "Enter your national ID number"
    },

    {
        code: "UG",
        name: "Uganda",
        flag: "🇺🇬",
        phoneCode: "+256",
        identity: "National Identification Number",
        placeholder: "Enter your NIN"
    },

    {
        code: "TZ",
        name: "Tanzania",
        flag: "🇹🇿",
        phoneCode: "+255",
        identity: "National Identification Number",
        placeholder: "Enter your NIDA number"
    },

    {
        code: "RW",
        name: "Rwanda",
        flag: "🇷🇼",
        phoneCode: "+250",
        identity: "National ID Number",
        placeholder: "Enter your national ID number"
    },

    {
        code: "ZM",
        name: "Zambia",
        flag: "🇿🇲",
        phoneCode: "+260",
        identity: "National Registration Card Number",
        placeholder: "Enter your NRC number"
    },

    {
        code: "ZW",
        name: "Zimbabwe",
        flag: "🇿🇼",
        phoneCode: "+263",
        identity: "National ID Number",
        placeholder: "Enter your national ID number"
    },

    {
        code: "CM",
        name: "Cameroon",
        flag: "🇨🇲",
        phoneCode: "+237",
        identity: "National Identity Card Number",
        placeholder: "Enter your identity number"
    },

    {
        code: "SL",
        name: "Sierra Leone",
        flag: "🇸🇱",
        phoneCode: "+232",
        identity: "National Identification Number",
        placeholder: "Enter your NIN"
    },

    {
        code: "LR",
        name: "Liberia",
        flag: "🇱🇷",
        phoneCode: "+231",
        identity: "National ID Number",
        placeholder: "Enter your national ID number"
    },

    {
        code: "GM",
        name: "The Gambia",
        flag: "🇬🇲",
        phoneCode: "+220",
        identity: "National ID Number",
        placeholder: "Enter your national ID number"
    },

    {
        code: "EG",
        name: "Egypt",
        flag: "🇪🇬",
        phoneCode: "+20",
        identity: "National ID Number",
        placeholder: "Enter your national ID number"
    },

    {
        code: "MA",
        name: "Morocco",
        flag: "🇲🇦",
        phoneCode: "+212",
        identity: "National Identity Card Number",
        placeholder: "Enter your CIN"
    },

    {
        code: "DZ",
        name: "Algeria",
        flag: "🇩🇿",
        phoneCode: "+213",
        identity: "National Identity Card Number",
        placeholder: "Enter your identity number"
    },

    {
        code: "TN",
        name: "Tunisia",
        flag: "🇹🇳",
        phoneCode: "+216",
        identity: "National Identity Card Number",
        placeholder: "Enter your identity number"
    },

    {
        code: "US",
        name: "United States",
        flag: "🇺🇸",
        phoneCode: "+1",
        identity: "Government-Issued ID Number",
        placeholder: "Enter your government ID number"
    },

    {
        code: "CA",
        name: "Canada",
        flag: "🇨🇦",
        phoneCode: "+1",
        identity: "Government-Issued ID Number",
        placeholder: "Enter your government ID number"
    },

    {
        code: "GB",
        name: "United Kingdom",
        flag: "🇬🇧",
        phoneCode: "+44",
        identity: "Government-Issued ID Number",
        placeholder: "Enter your government ID number"
    },

    {
        code: "FR",
        name: "France",
        flag: "🇫🇷",
        phoneCode: "+33",
        identity: "Government-Issued ID Number",
        placeholder: "Enter your ID number"
    },

    {
        code: "DE",
        name: "Germany",
        flag: "🇩🇪",
        phoneCode: "+49",
        identity: "Government-Issued ID Number",
        placeholder: "Enter your ID number"
    },

    {
        code: "IN",
        name: "India",
        flag: "🇮🇳",
        phoneCode: "+91",
        identity: "Government-Issued ID Number",
        placeholder: "Enter your ID number"
    },

    {
        code: "AE",
        name: "United Arab Emirates",
        flag: "🇦🇪",
        phoneCode: "+971",
        identity: "Emirates ID Number",
        placeholder: "Enter your Emirates ID"
    },

    {
        code: "AU",
        name: "Australia",
        flag: "🇦🇺",
        phoneCode: "+61",
        identity: "Government-Issued ID Number",
        placeholder: "Enter your ID number"
    }

];


/* =========================================================
   GET ELEMENTS
========================================================= */

const registerForm =
    document.getElementById("registerForm");

const fullName =
    document.getElementById("fullName");

const country =
    document.getElementById("country");

const countrySearch =
    document.getElementById("countrySearch");

const countryResults =
    document.getElementById("countryResults");

const selectedCountry =
    document.getElementById("selectedCountry");

const selectedCountryFlag =
    document.getElementById("selectedCountryFlag");

const selectedCountryName =
    document.getElementById("selectedCountryName");

const selectedCountryCode =
    document.getElementById("selectedCountryCode");

const identityGroup =
    document.getElementById("identityGroup");

const identityNumber =
    document.getElementById("identityNumber");

const identityHelp =
    document.getElementById("identityHelp");

const documentType =
    document.getElementById("documentType");

const documentTypeBox =
    document.getElementById("documentTypeBox");

const phone =
    document.getElementById("phone");

const email =
    document.getElementById("email");

const password =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

const dob =
    document.getElementById("dob");

const gender =
    document.getElementById("gender");

const goal =
    document.getElementById("goal");

const terms =
    document.getElementById("terms");

const showPassword =
    document.getElementById("showPassword");

const strengthBar =
    document.getElementById("strengthBar");

const passwordStrength =
    document.getElementById("passwordStrength");

const passwordMatch =
    document.getElementById("passwordMatch");

const registerSubmit =
    document.getElementById("registerSubmit");

const errorBox =
    document.getElementById("error");


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(message, type = "") {

    if (!errorBox) {
        return;
    }

    errorBox.textContent = message;
    errorBox.className = "form-result";

    if (type) {
        errorBox.classList.add(type);
    }
}


/* =========================================================
   COUNTRY FINDER
========================================================= */

function findCountry(value) {

    if (!value) {
        return null;
    }

    const search =
        String(value)
            .trim()
            .toLowerCase();

    return countries.find(item => {

        return (
            item.code.toLowerCase() === search ||
            item.name.toLowerCase() === search
        );

    }) || null;
}


/* =========================================================
   UPDATE COUNTRY
========================================================= */

function updateCountry(countryData) {

    if (!countryData) {
        return;
    }

    if (country) {
        country.value = countryData.code;
    }

    if (countrySearch) {
        countrySearch.value = countryData.name;
    }

    if (selectedCountryFlag) {
        selectedCountryFlag.textContent =
            countryData.flag;
    }

    if (selectedCountryName) {
        selectedCountryName.textContent =
            countryData.name;
    }

    if (selectedCountryCode) {
        selectedCountryCode.textContent =
            countryData.phoneCode;
    }

    if (selectedCountry) {
        selectedCountry.hidden = false;
        selectedCountry.style.display = "flex";
    }

    if (identityGroup) {
        identityGroup.hidden = false;
        identityGroup.style.display = "block";
    }

    const identityLabel =
        document.getElementById("identityLabel");

    if (identityLabel) {
        identityLabel.textContent =
            countryData.identity;
    }

    if (identityNumber) {

        identityNumber.disabled = false;

        identityNumber.placeholder =
            countryData.placeholder;
    }

    if (documentType) {
        documentType.textContent =
            countryData.identity;
    }

    if (documentTypeBox) {
        documentTypeBox.hidden = false;
        documentTypeBox.style.display = "block";
    }

    if (identityHelp) {

        identityHelp.textContent =
            `Enter your ${countryData.identity.toLowerCase()}.`;
    }

    if (phone) {

        phone.placeholder =
            countryData.phoneCode +
            " XX XXX XXXX";
    }

    hideCountryResults();
}


/* =========================================================
   COUNTRY SEARCH
========================================================= */

function renderCountryResults(searchValue = "") {

    if (!countryResults) {
        return;
    }

    const search =
        String(searchValue)
            .trim()
            .toLowerCase();

    const results =
        countries.filter(item => {

            if (!search) {
                return true;
            }

            return (
                item.name
                    .toLowerCase()
                    .includes(search) ||

                item.code
                    .toLowerCase()
                    .includes(search) ||

                item.phoneCode
                    .includes(search)
            );

        });

    countryResults.innerHTML = "";

    countryResults.hidden = false;
    countryResults.style.display = "block";

    if (!results.length) {

        const empty =
            document.createElement("div");

        empty.className = "country-result";
        empty.textContent = "No country found.";

        countryResults.appendChild(empty);

        return;
    }

    results.forEach(item => {

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "country-result";

        const flag =
            document.createElement("span");

        flag.className = "country-result-flag";
        flag.textContent = item.flag;

        const name =
            document.createElement("span");

        name.className = "country-result-name";
        name.textContent = item.name;

        const code =
            document.createElement("span");

        code.className = "country-result-code";
        code.textContent = item.code;

        button.appendChild(flag);
        button.appendChild(name);
        button.appendChild(code);

        button.addEventListener(
            "click",
            function () {
                updateCountry(item);
            }
        );

        countryResults.appendChild(button);

    });
}


/* =========================================================
   HIDE COUNTRY RESULTS
========================================================= */

function hideCountryResults() {

    if (!countryResults) {
        return;
    }

    countryResults.hidden = true;
    countryResults.style.display = "none";
}


/* =========================================================
   COUNTRY SEARCH EVENTS
========================================================= */

if (countrySearch) {

    countrySearch.addEventListener(
        "input",
        function () {

            /*
             * If the user changes the country text after
             * selecting a country, clear the hidden country
             * value so an old selection cannot be submitted.
             */

            if (country) {
                country.value = "";
            }

            if (identityGroup) {
                identityGroup.hidden = true;
            }

            if (selectedCountry) {
                selectedCountry.hidden = true;
            }

            renderCountryResults(
                countrySearch.value
            );
        }
    );

    countrySearch.addEventListener(
        "focus",
        function () {

            renderCountryResults(
                countrySearch.value
            );

        }
    );
}


/* =========================================================
   CLOSE COUNTRY RESULTS
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            countryResults &&
            countrySearch &&
            !countryResults.contains(event.target) &&
            event.target !== countrySearch
        ) {

            hideCountryResults();

        }

    }
);


/* =========================================================
   COUNTRY HIDDEN INPUT
========================================================= */

if (country) {

    country.addEventListener(
        "change",
        function () {

            const selected =
                findCountry(country.value);

            if (selected) {
                updateCountry(selected);
            }

        }
    );

}


/* =========================================================
   PASSWORD SHOW / HIDE
========================================================= */

function setupPasswordToggle() {

    if (!showPassword || !password) {

        console.warn(
            "AFRIORA: Password toggle elements not found."
        );

        return;
    }

    showPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (password.type === "password") {

                password.type = "text";

                showPassword.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

                showPassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

                showPassword.setAttribute(
                    "title",
                    "Hide password"
                );

            } else {

                password.type = "password";

                showPassword.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

                showPassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

                showPassword.setAttribute(
                    "title",
                    "Show password"
                );

            }

        }
    );

}

setupPasswordToggle();


/* =========================================================
   PASSWORD STRENGTH
========================================================= */

function checkPasswordStrength(value) {

    if (!strengthBar) {
        return;
    }

    let score = 0;

    if (value.length >= 8) {
        score++;
    }

    if (/[A-Z]/.test(value)) {
        score++;
    }

    if (/[a-z]/.test(value)) {
        score++;
    }

    if (/[0-9]/.test(value)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(value)) {
        score++;
    }

    const width =
        (score / 5) * 100;

    strengthBar.style.width =
        width + "%";

    if (passwordStrength) {

        const messages = [
            "",
            "Very weak",
            "Weak",
            "Fair",
            "Strong",
            "Very strong"
        ];

        passwordStrength.textContent =
            messages[score];
    }

    if (score <= 1) {

        strengthBar.style.background =
            "#ff4d6d";

    } else if (score <= 3) {

        strengthBar.style.background =
            "#d4a017";

    } else {

        strengthBar.style.background =
            "#68d89a";

    }

}


/* =========================================================
   PASSWORD INPUT
========================================================= */

if (password) {

    password.addEventListener(
        "input",
        function () {

            checkPasswordStrength(
                password.value
            );

            checkPasswordMatch();

        }
    );

}


/* =========================================================
   PASSWORD MATCH
========================================================= */

function checkPasswordMatch() {

    if (!password || !confirmPassword) {
        return true;
    }

    if (!confirmPassword.value) {

        confirmPassword.classList.remove(
            "valid",
            "invalid"
        );

        if (passwordMatch) {
            passwordMatch.textContent = "";
        }

        return true;
    }

    const matches =
        password.value ===
        confirmPassword.value;

    confirmPassword.classList.toggle(
        "valid",
        matches
    );

    confirmPassword.classList.toggle(
        "invalid",
        !matches
    );

    if (passwordMatch) {

        passwordMatch.textContent =
            matches
                ? "Passwords match."
                : "Passwords do not match.";

    }

    return matches;
}


/* =========================================================
   CONFIRM PASSWORD
========================================================= */

if (confirmPassword) {

    confirmPassword.addEventListener(
        "input",
        checkPasswordMatch
    );

}


/* =========================================================
   EMAIL VALIDATION
========================================================= */

function validEmail(value) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
            String(value).trim()
        );

}


/* =========================================================
   AGE VALIDATION
========================================================= */

function isValidAge(dateValue) {

    if (!dateValue) {
        return false;
    }

    const birthDate =
        new Date(
            dateValue + "T00:00:00"
        );

    if (Number.isNaN(birthDate.getTime())) {
        return false;
    }

    const today = new Date();

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
            today.getDate() < birthDate.getDate()
        )
    ) {
        age--;
    }

    return age >= 18;
}


/* =========================================================
   PHONE NORMALIZATION
========================================================= */

function normalizePhone(value) {

    return String(value)
        .trim()
        .replace(/[^\d+]/g, "");

}


/* =========================================================
   REGISTRATION CONTEXT
========================================================= */

function createRegistrationContext() {

    const selected =
        findCountry(
            country?.value
        );

    return {

        registrationId:
            "REG-" + Date.now(),

        fullName:
            fullName?.value.trim() || "",

        country:
            selected
                ? selected.code
                : country?.value || "",

        countryName:
            selected
                ? selected.name
                : "",

        phone:
            normalizePhone(
                phone?.value || ""
            ),

        email:
            email?.value
                .trim()
                .toLowerCase() || "",

        identityType:
            selected
                ? selected.identity
                : "",

        dob:
            dob?.value || "",

        gender:
            gender?.value || "",

        goal:
            goal?.value || "",

        createdAt:
            new Date().toISOString(),

        verificationStatus:
            "pending"
    };
}


/* =========================================================
   SAVE SAFE REGISTRATION DATA
========================================================= */

function saveRegistrationContext(registration) {

    const safeRegistration = {

        registrationId:
            registration.registrationId,

        authUserId:
            registration.authUserId || null,

        fullName:
            registration.fullName,

        country:
            registration.country,

        countryName:
            registration.countryName,

        phone:
            registration.phone,

        email:
            registration.email,

        identityType:
            registration.identityType,

        dob:
            registration.dob,

        gender:
            registration.gender,

        goal:
            registration.goal,

        verificationStatus:
            "pending",

        createdAt:
            registration.createdAt
    };

    sessionStorage.setItem(
        "pendingRegistration",
        JSON.stringify(safeRegistration)
    );
}


/* =========================================================
   CREATE SUPABASE ACCOUNT
   ---------------------------------------------------------
   Supabase sends the confirmation/OTP email according to
   your Auth email template configuration.

   If your Magic Link / OTP template contains:

       {{ .Token }}

   Supabase sends an OTP code.
========================================================= */

async function createSupabaseAccount() {

    const emailAddress =
        email.value
            .trim()
            .toLowerCase();

    const result =
        await AFRIORA_CLIENT.auth.signUp({

            email: emailAddress,

            password: password.value,

            options: {
                data: {
                    full_name:
                        fullName?.value.trim() || "",

                    country:
                        country?.value || ""
                }
            }

        });

    if (result.error) {

        console.error(
            "AFRIORA Supabase registration error:",
            result.error
        );

        throw result.error;
    }

    return result.data;
}


/* =========================================================
   SAVE OTP INFORMATION
========================================================= */

function saveOTPContext(emailAddress, userId) {

    sessionStorage.setItem(
        "pendingOTPEmail",
        emailAddress
    );

    if (userId) {

        sessionStorage.setItem(
            "pendingOTPUserId",
            userId
        );

    }
}


/* =========================================================
   REDIRECT TO OTP
========================================================= */

function goToOTP() {

    window.location.replace(
        OTP_PAGE
    );

}


/* =========================================================
   SAVE USER PROFILE TO SUPABASE
   ---------------------------------------------------------
   IMPORTANT:
   This function intentionally DOES NOT save identityNumber.

   Identity number should be handled later by your secure
   identity-verification process, not stored in browser
   sessionStorage.

   Your public.profiles table should have RLS enabled.
========================================================= */

async function saveUserProfileToSupabase(
    userId,
    registration
) {

    if (!userId) {

        throw new Error(
            "Cannot save profile without a user ID."
        );

    }

    const profileData = {

        id:
            userId,

        full_name:
            registration.fullName,

        country:
            registration.country,

        country_name:
            registration.countryName,

        phone:
            registration.phone,

        email:
            registration.email,

        date_of_birth:
            registration.dob,

        gender:
            registration.gender,

        relationship_goal:
            registration.goal,

        identity_type:
            registration.identityType,

        verification_status:
            "pending"
    };

    const {
        data,
        error
    } =
        await AFRIORA_CLIENT
            .from("profiles")
            .upsert(
                profileData,
                {
                    onConflict: "id"
                }
            )
            .select()
            .single();

    if (error) {

        console.error(
            "AFRIORA profile database error:",
            error
        );

        throw error;
    }

    return data;
}


/* =========================================================
   FORM SUBMISSION
========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            showMessage("");

            /* =================================================
               REQUIRED FIELDS
            ================================================= */

            if (
                !fullName?.value.trim() ||
                !country?.value ||
                !phone?.value.trim() ||
                !email?.value.trim() ||
                !identityNumber?.value.trim() ||
                !password?.value ||
                !confirmPassword?.value ||
                !dob?.value ||
                !gender?.value ||
                !goal?.value
            ) {

                showMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            /* =================================================
               EMAIL
            ================================================= */

            if (!validEmail(email.value)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                email.focus();

                return;
            }


            /* =================================================
               COUNTRY
            ================================================= */

            const selected =
                findCountry(country.value);

            if (!selected) {

                showMessage(
                    "Please select a valid country.",
                    "error"
                );

                countrySearch?.focus();

                return;
            }


            /* =================================================
               PASSWORD
            ================================================= */

            if (password.value.length < 8) {

                showMessage(
                    "Your password must contain at least 8 characters.",
                    "error"
                );

                password.focus();

                return;
            }


            /* =================================================
               PASSWORD MATCH
            ================================================= */

            if (!checkPasswordMatch()) {

                showMessage(
                    "Passwords do not match.",
                    "error"
                );

                confirmPassword.focus();

                return;
            }


            /* =================================================
               PASSWORD QUALITY
            ================================================= */

            let passwordScore = 0;

            if (password.value.length >= 8) {
                passwordScore++;
            }

            if (/[A-Z]/.test(password.value)) {
                passwordScore++;
            }

            if (/[a-z]/.test(password.value)) {
                passwordScore++;
            }

            if (/[0-9]/.test(password.value)) {
                passwordScore++;
            }

            if (/[^A-Za-z0-9]/.test(password.value)) {
                passwordScore++;
            }

            if (passwordScore < 3) {

                showMessage(
                    "Please create a stronger password using uppercase letters, lowercase letters, numbers, and symbols.",
                    "error"
                );

                password.focus();

                return;
            }


            /* =================================================
               AGE
            ================================================= */

            if (!isValidAge(dob.value)) {

                showMessage(
                    "You must be at least 18 years old to create an AFRIORA account.",
                    "error"
                );

                dob.focus();

                return;
            }


            /* =================================================
               TERMS
            ================================================= */

            if (!terms || !terms.checked) {

                showMessage(
                    "Please accept the Terms, Privacy Policy and Safety Rules.",
                    "error"
                );

                return;
            }


            /* =================================================
               EMAIL
            ================================================= */

            const emailAddress =
                email.value
                    .trim()
                    .toLowerCase();


            /* =================================================
               DISABLE BUTTON
            ================================================= */

            if (registerSubmit) {

                registerSubmit.disabled = true;

                registerSubmit.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

            }


            try {

                /* =================================================
                   CREATE REGISTRATION CONTEXT
                ================================================= */

                const registration =
                    createRegistrationContext();


                /* =================================================
                   CREATE SUPABASE AUTH USER
                ================================================= */

                const authData =
                    await createSupabaseAccount();

                const user =
                    authData?.user || null;


                if (!user) {

                    throw new Error(
                        "Supabase did not return a user account."
                    );

                }


                registration.authUserId =
                    user.id;


                /* =================================================
                   SAVE PROFILE
                   -------------------------------------------------
                   This was missing from your original flow.
                ================================================= */

                await saveUserProfileToSupabase(
                    user.id,
                    registration
                );


                /* =================================================
                   SAVE SAFE LOCAL CONTEXT
                ================================================= */

                saveRegistrationContext(
                    registration
                );


                /* =================================================
                   SAVE OTP CONTEXT
                ================================================= */

                saveOTPContext(
                    emailAddress,
                    user.id
                );


                console.log(
                    "AFRIORA account created:",
                    user.id
                );


                /* =================================================
                   SUCCESS
                ================================================= */

                showMessage(
                    "Account created. Check your email for your verification code.",
                    "success"
                );


                /* =================================================
                   GO TO OTP PAGE
                ================================================= */

                setTimeout(
                    goToOTP,
                    700
                );

            }

            catch (error) {

                console.error(
                    "AFRIORA registration error:",
                    error
                );

                const errorText =
                    String(
                        error?.message || ""
                    ).toLowerCase();

                let message =
                    "Unable to create your account. Please try again.";


                if (
                    errorText.includes("already registered") ||
                    errorText.includes("already exists") ||
                    errorText.includes("user already registered")
                ) {

                    message =
                        "An account with this email already exists. Please login instead.";

                }

                else if (
                    errorText.includes("password")
                ) {

                    message =
                        "Your password does not meet the required security rules.";

                }

                else if (
                    errorText.includes("invalid email")
                ) {

                    message =
                        "Please enter a valid email address.";

                }

                else if (
                    errorText.includes("email rate limit") ||
                    errorText.includes("rate limit")
                ) {

                    message =
                        "Too many verification emails were requested. Please wait a few minutes and try again.";

                }

                else if (
                    errorText.includes("signup is disabled")
                ) {

                    message =
                        "Account registration is currently disabled in Supabase.";

                }

                else if (
                    errorText.includes("email provider")
                ) {

                    message =
                        "Email verification is not configured correctly in Supabase.";

                }

                else if (
                    errorText.includes("network") ||
                    errorText.includes("fetch")
                ) {

                    message =
                        "Connection problem. Please check your internet connection and try again.";

                }

                else if (
                    errorText.includes("profiles")
                ) {

                    message =
                        "Your account was created, but your profile could not be saved. Please contact support.";

                }


                showMessage(
                    message,
                    "error"
                );


                if (registerSubmit) {

                    registerSubmit.disabled =
                        false;

                    registerSubmit.innerHTML =
                        '<i class="fa-solid fa-user-plus"></i> Continue to Verification';

                }

            }

        }
    );

}


/* =========================================================
   DOB LIMIT
========================================================= */

if (dob) {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dob.max = today;
}


/* =========================================================
   INITIAL COUNTRY
========================================================= */

if (country && country.value) {

    const initialCountry =
        findCountry(country.value);

    if (initialCountry) {
        updateCountry(initialCountry);
    }
}


/* =========================================================
   INITIAL STATE
========================================================= */

if (identityNumber) {
    identityNumber.disabled = true;
}

hideCountryResults();


/* =========================================================
   GLOBAL AFRIORA REGISTER API
========================================================= */

window.AFRIORA_REGISTER = {

    countries,

    findCountry,

    updateCountry,

    createRegistrationContext,

    saveRegistrationContext,

    createSupabaseAccount,

    saveUserProfileToSupabase,

    checkPasswordStrength,

    checkPasswordMatch,

    supabase:
        AFRIORA_CLIENT
};


/* =========================================================
   DEBUG CONFIRMATION
========================================================= */

console.log(
    "AFRIORA register.js loaded successfully."
);