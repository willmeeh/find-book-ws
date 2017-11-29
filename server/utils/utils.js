
const removeTextFromNumber = (number) => {
    return number.replace(/[^0-9\.]+/g, "");
}

module.exports = {
    removeTextFromNumber,
};