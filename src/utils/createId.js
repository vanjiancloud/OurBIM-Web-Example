import mathRandom from "./mathRandom"
export default function createId() {
    var timestamp = new Date().getTime().toString()
    let numList = mathRandom(3)
    const string=timestamp + numList[0] + numList[1] + numList[2]
    return string
}