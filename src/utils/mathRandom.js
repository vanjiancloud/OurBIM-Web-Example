export default function mathRandom(num) {
    let arr = []
    for (let i = 0; i < num; i++) {
        arr.push((Math.random() * 100).toFixed(0)*1)
    }
    return arr
}