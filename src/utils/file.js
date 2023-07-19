import { Message } from 'element-ui'
// url转blob,下载图片
export function urlToblob(url, func) {
	var canvas = document.createElement("canvas"); // 创建一个画板
	const image = new Image();
	image.setAttribute("crossOrigin", "Anonymous"); // 可能会有跨越问题
	image.src = url;
	image.onload = async () => {
		// img加载完成事件
		canvas.width = image.width; // 设置画板宽度
		canvas.height = image.height; // 设置画板高度
		canvas.getContext("2d").drawImage(image, 0, 0); // 加载img到画板
		canvas.toBlob(blob => {
			func(blob)
		}, 'image/png')
	};
}


// 使用fetch函数下载文件
export function downFile(url) {
	const spliceLength2 = url.lastIndexOf("/");
	const urlName = url.slice(spliceLength2 + 1);
	fetch(url)
		.then(response => response.blob())
		.then(blob => {
			Message({message: '下载文件可能过大，请等待。。。', duration: 5 * 1000})
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', urlName);
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		})
		.catch(error => {
			// console.error('下载文件时发生错误:', error);
			Message({message: '文件错误', type: 'error', duration: 5 * 1000})
		});
}
