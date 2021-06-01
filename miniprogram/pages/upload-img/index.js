// miniprogram/pages/upload-img/index.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: '',
		img_url: ''
	},
	selectImg() {
		let that = this;
		wx.chooseImage({
			count: 1,
			sizeType: ['original'],
			sourceType: ['album', 'camera'],
			success(res) {
				wx.showToast({
					title: '正在上传...',
					icon: 'loading',
					mask: true,
					duration: 500
				})
				const tempFilePaths = res.tempFilePaths[0];
				//重置图片角度、缩放、位置
				that.setData({
					img_url: tempFilePaths
				});
			}
		})
	},
	confirm() {
		const db = wx.cloud.database()
		wx.showLoading({
			title: '上传中',
		})
		db.collection('image').add({
				// data 字段表示需新增的 JSON 数据
				data: {
					name: this.data.name,
					img_url: this.data.img_url
				}
			})
			.then(res => {
				// console.log(res)
				wx.showLoading({
					title: '上传成功',
				})
				wx.hideLoading()
			})
	},
	nameInput(e) {
		this.data.name = e.detail.value
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})