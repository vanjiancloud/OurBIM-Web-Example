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

// base64转blob
export function base64ToBlob(dataurl) {
	let arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new Blob([u8arr], { type: mime })
}

// base64转file
export function base64toFile(base64Str, fileName) {
	let arr = base64Str.split(',');
	let mime = arr[0].match(/:(.*?);/)[1];
	let bstr = atob(arr[1]);
	let n = bstr.length;
	let u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], fileName, { type: mime })
}


// 使用fetch函数下载文件
export function downFile(fileUrl, name) {
	const spliceLength2 = fileUrl.lastIndexOf("/");
	const urlName = name || fileUrl.slice(spliceLength2 + 1);
	let errblob = {};
	let msg = ''
	fetch(fileUrl)
		.then(async response => {
			msg = Message({message: '文件正在下载中，请等待。。。', duration: 0})
			errblob = new Blob([response])
			return response.blob()
		})
		.then(blob => {
			msg.close()
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
			// Message({message: '文件错误', type: 'error', duration: 5 * 1000})
			msg.close()
			const url = window.URL.createObjectURL(errblob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', urlName);
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		});
}

// 转base64
export function getBase64(file) {
	return new Promise(function(resolve, reject) {
		let reader = new FileReader()
		let imgResult = ''
		reader.readAsDataURL(file)
		reader.onload = function() {
			imgResult = reader.result
		}
		reader.onerror = function(error) {
			reject(error)
		}
		reader.onloadend = function() {
			resolve(imgResult)
		}
	})
}

// 文件单位转化
export function fileUnit(val){
	let numVal = Number(val)
	if (numVal < 1024) {
		return numVal + 'MB'
	} else if(numVal/1024 < 1024) {
		return (numVal/1024).toFixed(2) + 'GB'
	} else if(numVal/1024/1024 < 1024) {
		return (numVal/1024/1024).toFixed(2) + 'TB'
	}
}