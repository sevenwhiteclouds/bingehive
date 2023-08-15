function isUsernameValid(username, min, max) {
    const chars = /^[a-zA-Z0-9]+$/;
    const length = username.length;
    const check = chars.test(username);

    return ((length >= min) && (length <= max) && (check));
}

function isPasswordValid(password, min, max) {
    const chars = /^[a-zA-Z0-9~!@#$%^&*()]+$/;
    const length = password.length;
    const check = chars.test(password);

    return ((length >= min) && (length <= max) && (check));
}

function isNameValid(name, min, max) {
    const chars = /^[a-zA-Z -]+$/;
    const length = name.length;
    let check = chars.test(name);

    return ((length >= min) && (length <= max) && (check));
}

module.exports = {
    isNameValid,
    isPasswordValid,
    isUsernameValid
};