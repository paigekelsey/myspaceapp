// Shows error outline
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

function signInValidator() {
    // Get references to the DOM
    const form = document.getElementById("sign-up-form");
    const username = document.getElementById("username-input");
    const password = document.getElementById("password-input");

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

    checkLength(username, 3, 30);
    checkLength(password, 8, 128);

    let allValid = true;

    const entries = [...form.querySelectorAll("div")];
    entries.forEach((entry) => {
        if ([...entry.classList].includes("error")) {
            allValid = false;
        }
    });

    return allValid;
}

export default signInValidator;
export { showError, showSuccess };
