<template>
	<div class="qa">
		<header>
			<header-title title="在线答题"/>
		</header>
		<article>
			<div class="subject">
				<!--序号-->
				<div class="subject_header d-flex align-items-center justify-content-between">
					<div class="subject_type d-flex align-items-center">
						<div class="subject_gutter">{{ dataObject.subjectType | subjectText }}</div>
						<div class="tip text-center">查看提示</div>
					</div>
					<div class="subject_num">
						<span>{{ currentIndex + 1 }}</span>
						<span>/</span>
						<span>{{ subjectTotalCount }}</span>
					</div>
				</div>
				<!--题目-->
				<div class="subject_content" v-if="dataObject.subjectType !== 3">{{ dataObject.topic }}</div>

				<div class="subject_content" v-else>
					<span v-for="(item, index) in fillBlank">
						{{ item }}<input type="text" class="fill_topic" v-model="selectList[index]" v-if="index < fillBlank.length - 1"/>
					</span>
				</div>

				<!--选项-->
				<div class="subject_option" v-if="dataObject.subjectType !== 3">
					<div class="item-select" @click="handleCheckClick($event, item.id)" :ref="item.id" v-for="(item, index) in dataObject.answerList" :key="item.id">
						<div class="select d-flex flex-nowrap align-items-center">
							<!--字母编号-->
							<div class="letter_num">{{ letterNum[index] }}.</div>
							<!--正确错误答案-->
							<div class="answer_img"></div>
							<!--选项文字-->
							<div class="answer_text">{{ item.answer }}</div>
						</div>
					</div>
					<div class="mask" v-show="isShowMask"></div>
				</div>
			</div>

			<!--是否回答正确-->
			<div class="answer" v-if="isShowRightAnswer">
				<div class="answer_header d-flex align-items-center justify-content-between">
					<div class="answer_gutter">答案解析</div>
				</div>
				<div class="answer_content">
					<p>正确答案: <span v-for="item in rightAnswer">{{ item }}</span></p>
					<div class="answer_parsing">
						{{ dataObject.parsing }}
					</div>
				</div>
			</div>
		</article>
		<!--按鈕-->
		<footer class="position-fixed">
			<div class="btn text-center">
				<div @click="handleSubmitClick" v-if="!isNextSubject">确定</div>
				<div @click="handleNextSubjectClick" v-else>{{ nextText }}</div>
			</div>
		</footer>
	</div>
</template>

<script>
import HeaderTitle from './components/HeaderTitle'

import dataList from '@/assets/dataList'
import common from '@/utils/common'

export default {
	name: 'Index',
	components: {HeaderTitle},
	data() {
		return {
			currentIndex: 0,
			subjectTotalCount: 0,
			dataObject: {
				subjectType: 0,
				topic: '',
				answerList: [],
				parsing: '',
				rightAnswerId: []
			},
			selectList: [],		// 当前题选中列
			rightAnswer: [],	// 正确答案
			myAnswer: [],		// 提交的答案

			isShowImg: false,
			letterNum: ['A', 'B', 'C', 'D', 'E', 'F'],
			isShowMask: false,			// 遮罩层
			isShowRightAnswer: false,	// 是否选对
			nextText: '下一题',
			isNextSubject: false,
			fillBlank: [],		// 填空题
		}
	},
	methods: {
		loadData() {
			let dataObj = this.dataObject
			// 题目列表
			let subjectObj = dataList.subject
			// 总题数
			this.subjectTotalCount = subjectObj.length

			// 指定题目 默认第一题
			let itemIndex = subjectObj[this.currentIndex]
			dataObj.parsing = itemIndex.parsing
			dataObj.subjectType = itemIndex.subjectType
			dataObj.answerList = itemIndex.answerList
			dataObj.topic = itemIndex.topic
			dataObj.rightAnswerId = itemIndex.rightAnswerId

			if (itemIndex.subjectType === 3) {
				this.fillBlank = dataObj.topic.split('#')
			}
		},
		// 选中处理
		handleCheckClick(e, index) {
			let {subjectType} = this.dataObject

			if (subjectType === 1) {
				// 多选
				this.clickMultipleChoice(e, index)
			} else if (subjectType === 2) {
				// 单选
				this.clickSingleChoice(e, index)
			}
			console.log(this.selectList)
		},
		// 点击多选
		clickMultipleChoice(e, index) {
			let arr = this.selectList
			if (arr.length >= 0) {
				// 查找数组对应索引
				let arrIndex = arr.indexOf(index)
				// 不存在时为-1 -> 进行追加
				if (arrIndex === -1) {
					e.currentTarget.classList.add('active')
					arr.push(index)
				} else {
					e.currentTarget.classList.remove('active')
					arr.splice(arrIndex, 1)
				}
			}
		},
		// 点击单选
		clickSingleChoice(e, index) {
			let arr = this.selectList
			if (arr.length >= 0) {
				// 查找数组对应索引
				let arrIndex = arr.indexOf(index)
				// 不存在时为-1 -> 进行追加
				if (arrIndex >= 0) {
					e.currentTarget.classList.remove('active')
					arr.splice(arrIndex, 1)
				} else {
					e.currentTarget.classList.add('active')
					arr.push(index)
					if (arr.length > 1) {
						this.$refs[arr[0]].forEach(item => {
							item.classList.remove('active')
						})
						e.currentTarget.classList.add('active')
						arr.splice(0, 1)
					}

				}
			}
		},
		// 点击按钮提交
		handleSubmitClick() {
			let {subjectType} = this.dataObject

			// 判断是否有选择
			if (this.selectList.length === 0) {
				alert('至少选择一个答案')
				return
			}

			let {subject} = dataList
			if (this.currentIndex === subject.length - 1) {
				this.nextText = '提交'
			}

			// 存储答案
			this.myAnswer.push({
				index: this.currentIndex,
				answer: this.selectList
			})

			common.setLocalStorage('SET_MY_ANSWER', this.myAnswer)

			// 根据题目类型判断
			if (subjectType === 1) {
				this.multipleChoiceIsRight()
			} else if (subjectType === 2) {
				this.singleChoiceIsRight()
			} else {
				this.fillBlankIsRight()
			}
			this.handleRightAnswer()
		},
		// 下一题
		handleNextSubjectClick() {
			this.selectList = []

			let {answerList, subjectType} = this.dataObject
			let {subject} = dataList

			// 最后一题点击跳转结算页面
			if (this.currentIndex === subject.length - 1) {
				this.$router.replace({path: '/result'})
				return
			}

			// 显示确定按钮
			this.isNextSubject = false
			// 屏蔽点击事件
			this.isShowMask = false
			// 隐藏正确答案
			this.isShowRightAnswer = false

			if (subjectType !== 3) {
				for (let i = 0; i < answerList.length; i++) {
					this.$refs[answerList[i].id].forEach(item => {
						item.classList.remove('active')
						item.classList.remove('error')
						let letter_num = item.children[0].children[0]
						let answer_img = item.children[0].children[1]
						letter_num.style.display = 'block'
						answer_img.style.display = 'none'
						answer_img.classList.remove('confirm')
						answer_img.classList.remove('error')
					})
				}
			}

			let currentIndex = this.currentIndex += 1
			common.setLocalStorage('SET_CURRENT_INDEX', currentIndex)
			this.loadData()
		},
		// 正确答案样式
		rightStyle(rightAnswerId) {
			for (let i = 0; i < rightAnswerId.length; i++) {
				this.$refs[rightAnswerId[i]].forEach(item => {
					item.classList.add('active')
					let letter_num = item.children[0].children[0]
					let answer_img = item.children[0].children[1]
					letter_num.style.display = 'none'
					answer_img.classList.add('confirm')
					answer_img.style.display = 'block'
				})
			}
			// 显示正确答案
			this.isShowRightAnswer = true
			// 屏蔽点击事件
			this.isShowMask = true
			// 显示下一题按钮
			this.isNextSubject = true
		},
		// 错误答案样式
		wrongStyle(index, selectList) {
			for (let i = 0; i < selectList.length; i++) {
				this.$refs[selectList[index]].forEach(item => {
					item.classList.remove('active')
					item.classList.add('error')
					let letter_num = item.children[0].children[0]
					let answer_img = item.children[0].children[1]
					letter_num.style.display = 'none'
					answer_img.classList.add('error')
					answer_img.style.display = 'block'
				})
			}
		},
		// 多选题判断
		multipleChoiceIsRight() {
			// 正确答案列表
			let {rightAnswerId} = this.dataObject
			// 根据长度判断对应样式
			if (this.selectList.length === rightAnswerId.length) {
				let flag = true
				for (const index of rightAnswerId.keys()) {
					let isExist = rightAnswerId.includes(this.selectList[index])
					if (!isExist) {
						// 正确答案样式
						this.rightStyle(rightAnswerId)
						// 错误答案样式
						this.wrongStyle(index, this.selectList)
						flag = false
					}
				}
				if (flag) {
					this.handleNextSubjectClick()
				}
			} else if (this.selectList.length > rightAnswerId.length) {
				for (const index of this.selectList.keys()) {
					if (!rightAnswerId.includes(this.selectList[index])) {
						this.rightStyle(rightAnswerId)
						this.wrongStyle(index, this.selectList)
					}
				}
			} else {
				for (const index of this.selectList.keys()) {
					if (!rightAnswerId.includes(this.selectList[index])) {
						this.rightStyle(rightAnswerId)
						this.wrongStyle(index, this.selectList)
					} else {
						this.rightStyle(rightAnswerId)
					}
				}
			}
		},
		// 单选题判断
		singleChoiceIsRight() {
			let {rightAnswerId} = this.dataObject
			// 根据长度判断对应样式
			let flag = true
			for (const index of rightAnswerId.keys()) {
				if (!rightAnswerId.includes(this.selectList[index])) {
					// 正确答案样式
					this.rightStyle(rightAnswerId)
					// 错误答案样式
					this.wrongStyle(index, this.selectList)
					flag = false
				}
			}
			if (flag) {
				this.handleNextSubjectClick()
			}
		},
		// 判断填空题是否正确
		fillBlankIsRight() {
			// 答案列表
			let {rightAnswerId} = this.dataObject
			// 根据长度判断对应样式
			if (this.selectList.length === rightAnswerId.length) {
				for (const index of rightAnswerId.keys()) {
					if (!rightAnswerId.includes(this.selectList[index])) {
						// 显示正确答案
						this.isShowRightAnswer = true
						// 屏蔽点击事件
						this.isShowMask = true
						// 显示下一题按钮
						this.isNextSubject = true
						return
					}
				}
				this.handleNextSubjectClick()
			}
		},
		// 处理正确答案
		handleRightAnswer() {
			// 清空正确答案
			this.rightAnswer = []
			// 遍历正确答案字母
			let {answerList, rightAnswerId, subjectType} = this.dataObject
			if (subjectType === 3) {
				this.rightAnswer = rightAnswerId
			} else {
				// ['bbb', 'aaa']
				for (let i = 0; i < rightAnswerId.length; i++) {
					// ['bbb', 'aaa', 'ccc', 'ddd']
					for (let j = 0; j < answerList.length; j++) {
						if (rightAnswerId[i] === answerList[j].id) {
							this.rightAnswer.push(this.letterNum[j])
						}
					}
				}
			}
		},
	},
	created() {
		this.currentIndex = common.getLocalStorage('SET_CURRENT_INDEX') || 0
		this.myAnswer = common.getLocalStorage('SET_MY_ANSWER') || []
		this.loadData()
	},
	filters: {
		subjectText(val) {
			if (val === 1) {
				return '多选题'
			} else if (val === 2) {
				return '单选题'
			} else {
				return '填空题'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
$sideWidth: 1.25rem;
$paddingWidth: 1.13rem;
$boxShadow: 0 0.19rem 0.44rem 0 rgba(0, 0, 0, 0.08);
$borderRadius: 0.63rem;
$white: #ffffff;

.qa {
	article {
		padding-top: 3rem;
		padding-bottom: 6rem;

		.subject {
			background-color: $white;
			box-shadow: $boxShadow;
			border-radius: $borderRadius;
			margin: $sideWidth;

			.subject_header {
				position: relative;
				padding: 0 $paddingWidth;

				&:after {
					position: absolute;
					content: '';
					width: 100%;
					height: 0;
					border-bottom: solid 0.03rem #707070;
					opacity: 0.4;
					bottom: 0;
					margin-left: -1.13rem;
				}

				.subject_type {
					height: 2.8rem;

					.subject_gutter {
						height: 1.25rem;
						border-left: 0.19rem solid #df2a2a;
						padding-left: 0.69rem;
						font-size: 1rem;
						line-height: 1.25rem;
					}

					.tip {
						background-color: $white;
						border-radius: 0.56rem;
						border: solid 0.03rem #ffa127;
						height: 1.2rem;
						line-height: 1.2rem;
						font-size: 0.63rem;
						color: #ffa127;
						margin-left: 0.69rem;
						padding: 0 0.5rem;
					}
				}

				.subject_num {
					font-size: 1.88rem;
					font-weight: bold;

					span {
						font-size: 1rem;
						color: #333333;

						&:first-child {
							font-size: 1.88rem;
						}

						&:last-child {
							color: #999999;
						}
					}
				}
			}

			.subject_content {
				padding: $paddingWidth $paddingWidth 2.56rem;
				font-size: 1rem;
				line-height: 1.56rem;
				color: #333333;
			}

			.subject_option {
				padding: 0 1.43rem 1.43rem;
				position: relative;

				.item-select {
					margin-bottom: 0.94rem;
					width: 100%;
					height: 2.63rem;
					border-radius: 1.31rem;
					border: 0.06rem solid rgba(112, 112, 112, 0.55);
					background-color: rgba(241, 238, 238, 0.55);

					&.active {
						border: 0.06rem solid rgba(82, 196, 26, 0.55);
						background-color: rgba(180, 235, 169, 0.55);
					}

					&.error {
						border: 0.06rem solid rgba(255, 45, 45, 0.55);
						background: rgba(255, 148, 148, 0.55);
					}

					.select {
						height: 100%;
						padding: 0 1.13rem;

						.letter_num {
							width: 1rem;
							height: 1rem;
						}

						.answer_img {
							width: 1rem;
							height: 1rem;
							font-size: 1rem;
							line-height: 1rem;
							display: none;

							&.confirm {
								background: url("./../../assets/image/dui.png") no-repeat center;
								background-size: contain;
							}

							&.error {
								background: url("./../../assets/image/cuo.png") no-repeat center;
								background-size: contain;
							}
						}

						.answer_text {
							color: #333333;
							font-size: 1rem;
							padding-left: 0.5rem;
						}
					}

				}

				.mask {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0;
					left: 0;
					right: 0;
				}
			}
		}

		.answer {
			margin: $sideWidth;
			padding-bottom: 1rem;
			background-color: $white;
			box-shadow: $boxShadow;
			border-radius: $borderRadius;

			.answer_header {
				padding: 0 $paddingWidth;
				position: relative;
				height: 2.8rem;

				&:after {
					position: absolute;
					content: '';
					width: 100%;
					height: 0;
					border-bottom: solid 0.03rem #707070;
					opacity: 0.4;
					bottom: 0;
					margin-left: -1.13rem;
				}

				.answer_gutter {
					height: 1.25rem;
					border-left: 0.19rem solid #df2a2a;
					padding-left: 0.69rem;
					font-size: 1rem;
					line-height: 1.25rem;
				}
			}

			.answer_content {
				p {
					padding: 1.44rem $paddingWidth 1.38rem;

					span {
						margin-right: 1rem;
					}
				}

				.answer_parsing {
					padding: 0 $paddingWidth 1.38rem;
				}
			}
		}
	}

	footer {
		margin: 2rem 1rem;
		bottom: 0;
		left: 0;
		right: 0;

		.btn {
			background-color: #df2a2a;
			font-size: 1rem;
			color: #ffffff;
			line-height: 3rem;
			border-radius: 0.3rem;
			box-shadow: 0 0.2rem 0.44rem 0 rgba(0, 0, 0, 0.1);
		}
	}
}
</style>
<style>
.fill_topic {
	outline: none;
	border-bottom: 1px solid #333333;
	width: 4rem;
	color: #df2a2a;
	text-align: center;
	font-size: 1rem;
}
</style>
