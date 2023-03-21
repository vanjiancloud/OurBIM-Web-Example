import { Message } from "element-ui";

export default function resMessage(res) {
    if (res.code === 0) {
        Message.success(res.message);
    } else {
        Message.error(res.message);
    }
}