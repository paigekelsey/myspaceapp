function resetSignUpFormStyes() {
    const smalls = document.getElementsByTagName("small");
    [...smalls].forEach((small) => (small.innerText = ""));

    const formControls = document.querySelectorAll(".attn");
    formControls.forEach((div) => (div.className = "form-control attn"));
}

export default resetSignUpFormStyes;
