const dataList = {
	// 问题
	subject: [
		{
			id: '11',
			subjectType: 2,	// 1是多选 2是单选 3是填空
			topic: '驾驶机动车在道路上违反道路交通安全法的行为，属于什么行为？',
			answerList: [
				{
					id: 'A',
					answer: '违章行为',
				}, {
					id: 'B',
					answer: '违法行为',
				}, {
					id: 'C',
					answer: '违规行为',
				}, {
					id: 'D',
					answer: '过失行为',
				}
			],
			rightAnswerId: ['B'],
			parsing: '这是一个单选题'
		}, {
			id: '22',
			subjectType: 1,	// 1是多选 2是单选 3是填空
			topic: '【 多选题 】下列关于驾驶汽车突然变道加塞说法正确的是什么？',
			answerList: [
				{
					id: 'A',
					answer: '提高通行效率',
				}, {
					id: 'B',
					answer: '缓解交通拥堵',
				}, {
					id: 'C',
					answer: '易引发交通事故',
				}, {
					id: 'D',
					answer: '造成道路拥堵',
				}
			],
			rightAnswerId: ['C', 'D'],
			parsing: '多选题！！！'
		}, {
			id: '33',
			subjectType: 2,	// 1是多选 2是单选 3是填空
			topic: '驾驶机动车违反道路交通安全法律法规发生交通事故属于交通违章行为。',
			answerList: [
				{
					id: 'A',
					answer: '正确',
				}, {
					id: 'B',
					answer: '错误',
				}
			],
			rightAnswerId: ['A'],
			parsing: '单选题！！！！！！'
		}, {
			id: '44',
			subjectType: 1,	// 1是多选 2是单选 3是填空
			topic: '【 多选题 】行车中不应该有以下哪些行为？',
			answerList: [
				{
					id: 'A',
					answer: '变更车道不开启转向灯',
				}, {
					id: 'B',
					answer: '左臂长时间搭在车门窗上',
				}, {
					id: 'C',
					answer: '长时间抓变速杆',
				}, {
					id: 'D',
					answer: '经常观察后视镜',
				}
			],
			rightAnswerId: ['A', 'B', 'C'],
			parsing: '这是一道多选题'
		}, {
			id: '55',
			subjectType: 3,	// 1是多选 2是单选 3是填空
			topic: '填写第一个空111#填写第二个空222#中国共产党第一次全国代表大会',
			rightAnswerId: ['111', '222'],
			parsing: '填空题填空题填空题填空题填空题填空题'
		}, {
			id: '66',
			subjectType: 2,	// 1是多选 2是单选 3是填空
			topic: '驾驶机动车在道路上违反道路交通安全法的行为，属于什么行为？',
			answerList: [
				{
					id: 'A',
					answer: '违章行为',
				}, {
					id: 'B',
					answer: '违法行为',
				}, {
					id: 'C',
					answer: '违规行为',
				}, {
					id: 'D',
					answer: '过失行为',
				}
			],
			rightAnswerId: ['B'],
			parsing: '这是一个单选题'
		},
	]
}

export default dataList
