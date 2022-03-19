const { validate } = require("email-validator");

// Show input error message
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control attn error";
    const small = formControl.querySelector("small");
    small.innerText = message;
}

//Show success outline
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "form-control attn success";
}

function signUpValidator() {
    // Get references to the DOM
    const form = document.getElementById("sign-up-form");
    const email = document.getElementById("email-input");
    const username = document.getElementById("username-input");
    const password = document.getElementById("password-input");
    const confirmPassword = document.getElementById("confirmPassword-input");

    // Get field name
    function getFieldName(input) {
        const name = input.id.charAt(0).toUpperCase() + input.id.slice(1);
        return name.replace(/-/g, " ").substring(0, name.length - 6);
    }

    // Validates Length
    function checkLength(input, min, max) {
        if (input.value.length < min) {
            showError(
                input,
                `${getFieldName(input)} must be at least ${min} characters`,
            );
        } else if (input.value.length > max) {
            showError(
                input,
                `${getFieldName(input)} must be less than ${max} characters`,
            );
        } else {
            showSuccess(input);
        }
    }

    // Validates Email
    function checkEmail(input) {
        const isEmail = validate(input.value.trim());
        if (isEmail) {
            showSuccess(input);
        } else {
            showError(input, `${getFieldName(input)} must be a valid email`);
        }
    }

    function checkEqual(input1, input2) {
        const isEqual = input1.value === input2.value;
        if (isEqual) {
            showSuccess(input1);
            showSuccess(input2);
            return true;
        } else {
            showError(input1, `Passwords must match`);
            showError(input2, `Passwords must match`);
            return false;
        }
    }

    checkEmail(email);
    checkLength(username, 3, 30);
    checkLength(password, 8, 128);
    checkLength(confirmPassword, 8, 128);

    let allValid = true;

    const entries = [...form.querySelectorAll("div")];
    entries.forEach((entry) => {
        if ([...entry.classList].includes("error")) {
            allValid = false;
        }
    });

    if (allValid === true) {
        const equal = checkEqual(password, confirmPassword);
        return equal;
    }

    return allValid;
}

export default signUpValidator;
export { showError, showSuccess };
