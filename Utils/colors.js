const colors = ['green', 'red', 'pink', 'blue', 'yellow'];
let idx = 0;
const getColor = () => {
    const color = colors[idx];
    idx = (idx + 1) % 5;
    return color;
}
module.exports = getColor;