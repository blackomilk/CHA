const app = getApp()


Page({
	data: {
		boxList: []
	},
	onLoad() {
		this.getImgList()

	},
	getImgList() {
		const db = wx.cloud.database()

		db.collection('image').where({
		}).get().then(res => {
			// console.log(res.data)
			this.setData({
				boxList: res.data
			})
		})

	},
	handleBoxItemClick(e) {
		const item = e.currentTarget.dataset.item
		wx.navigateTo({
			url: '../selectAvatar/index?item_url=' + item.img_url,
		})
	}
})