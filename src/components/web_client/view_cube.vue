<!--
 * @Author: zk
 * @Date: 2021-03-08 09:27:06
 * @LastEditors: zk
 * @LastEditTime: 2021-03-08 09:41:31
 * @description: 
-->
<template>
    <div class="box-main">
        <div id="box" :style="{transform:`perspective(800px) rotateX(${downInfo.x}deg) rotateY(${downInfo.y}deg) rotateZ(${downInfo.z}deg)`}">
			<div @click="handleBody(0)" class="front">前</div>
			<div @click="handleBody(1)" class="back">后</div>
			<div @click="handleBody(2)" class="top">上</div>
			<div @click="handleBody(3)" class="bottom">下</div>
			<div @click="handleBody(4)" class="left">左</div>
			<div @click="handleBody(5)" class="right">右</div>
		</div>
		<img class="go-front" @click="goFront" src="../../assets/images/todo/home.png" mode=""></img>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                downInfo: {
					x: -25,
					y: -25,
					z: 0,
				},
				disX: 90,
				disY: 0,
				isMonitor: false,
            }
        },
        methods: {
            goFront() {
				this.$emit("handleOrder", 6)
			},
			handleBody(e) {
				/**
				 * @Author: zk
				 * @Date: 2020-09-21 09:44:35
				 * @description: 旋转确认 前 0 后 1 上 2 下 3 左 4 右 5
				 */
				switch (e) {
					case 0:
						this.downInfo = {
							x: -25,
							y: -25,
							z: 0,
						};
						break;
					case 1:
						this.downInfo = {
							x: -25,
							y: 155,
							z: 180,
						};
						break;
					case 2:
						this.downInfo = {
							x: -115,
							y: 0,
							z: -25,
						};
						break;
					case 3:
						this.downInfo = {
							x: 65,
							y: 180,
							z: -25,
						};
						break;
					case 4:
						this.downInfo = {
							x: -25,
							y: 65,
							z: 0,
						};
						break;
					case 5:
						this.downInfo = {
							x: -25,
							y: -115,
							z: 0,
						};
						break;
					default:
						break;
				}
				this.$emit("handleOrder", e)
			},
        },
    }
</script>

<style lang="less" scoped>
.box-main {
		position: fixed;
        top: 26px;
        right: 36px;
		.go-front {
			width: 0.83vw;
			height: 1.48vh;
			position: absolute;
			top: -10px;
			left: -20px;
		}
	}

	#box {
		width: 34px;
		height: 34px;
		position: relative;
		top: 0px;
		left: 30%;
		transform-style: preserve-3d;
		transition: all 2s;
	}

	#box div {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		height: 100%;
		width: 100%;
		position: absolute;
        cursor: pointer;
		top: 0;
		left: 0;
		background-size: cover;
		color: #04D8FC;
	}
    .front {
		transform: translateZ(17px);
		background: url("../../assets/images/todo/front.png");
	}

	.back {
		transform: translateZ(-17px) rotateX(180deg);
		background: url("../../assets/images/todo/front.png");
	}

	.left {
		transform: translateX(-17px) rotateY(270deg);
		background: url("../../assets/images/todo/front.png");
	}

	.right {
		transform: translateX(17px) rotateY(90deg);
		background: url("../../assets/images/todo/front.png");
	}

	.top {
		transform: translateY(-17px) rotateX(90deg);
		background: url("../../assets/images/todo/front.png");
	}

	.bottom {
		transform: translateY(17px) rotateX(90deg) rotateY(180deg);
		background: url("../../assets/images/todo/front.png");
	}
</style>