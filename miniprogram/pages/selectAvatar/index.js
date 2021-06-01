// // pages/selectAvatar/selectAcatar.js
var ctx = wx.createCanvasContext('flagctx')
const app = getApp()


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openSettingBtnHidden: true, //是否授权
		box_url: '',
		item_url: '',
		select_img: '',
		imgName: '',
		img_url: ''
	},
	//内部上传图片
	uploadImage() {
		wx.navigateTo({
			url: '../upload-img/index',
		})
	},
	//两张图片画到一起
	drawImage(avatarUrl, item_url) {
		const that = this
		let promise1 = new Promise(function (resolve, reject) {
			wx.getImageInfo({
				src: avatarUrl,
				success: res => {
					// console.log('1111',res)
					resolve(res)
				}
			})
		})
		let promise2 = new Promise(function (resolve, reject) {
			wx.getImageInfo({
				src: item_url,
				success: res => {
					// console.log('2222',res)

					resolve(res)
				}
			})
		})

		Promise.all([promise1, promise2]).then(res => {
			// let width = 320
			// let height = 240
			ctx.drawImage(res[0].path, 0, 0, 500, 500)
			ctx.drawImage(res[1].path, 0, 0, 500, 500)
			ctx.draw(false, () => {
				// setTimeout(() => {
					wx.canvasToTempFilePath({
						x: 0,
						y: 0,
						width: 500,
						height: 500,
						destHeight: 1000,
						destWidth: 1000,
						canvasId: 'flagctx',
						fileType: 'jpg',
						quality: '1',
						success: res => {
							that.setData({
								box_url: res.tempFilePath
							})
							wx.hideLoading()
						},
						fail: err => {
							console.log(err)
						}
					})
				// }, 1000);
			})
		})
	},
	//保存本地
	saveImg() {
		const that = this
		//获取相册授权
		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							//这里是用户同意授权后的回调
							that.saveImgToLocal();
						},
						fail() { //这里是用户拒绝授权后的回调
							that.setData({
								openSettingBtnHidden: false
							})
						}
					})
				} else { //用户已经授权过了
					that.saveImgToLocal();
				}
			}
		})
	},
	saveImgToLocal: function (e) {
		let that = this;

		let imgSrc = that.data.box_url;
		wx.showLoading({
			title: '保存中',
		})
		let c = this.getCurrentDate()
		wx.cloud.uploadFile({
			cloudPath: `${c}.png`,
			filePath: imgSrc,
			success: res => {
				wx.cloud.getTempFileURL({
					fileList: [{
						fileID: res.fileID,
						maxAge: 60 * 60
					}]
				}).then(ress => {
					wx.hideLoading()
					wx.downloadFile({
						url: ress.fileList[0].tempFileURL,
						success: function (res) {
							//图片保存到本地
							wx.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function (data) {
									wx.showToast({
										title: '保存成功',
										icon: 'success',
										duration: 2000
									})
								},
							})
						},
						fail: function (err) {
							console.log(err)
						}
					})
				})
			},
			fail: err => {
				// handle error
				console.log('err',err)
		}
		})
	},
	// 授权
	handleSetting: function (e) {
		let that = this;
		// 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮

		if (!e.detail.authSetting['scope.writePhotosAlbum']) {
			// wx.showModal({
			//   title: '警告',
			//   content: '若不打开授权，则无法将图片保存在相册中！',
			//   showCancel: false
			// })
			that.setData({
				openSettingBtnHidden: false
			})
		} else {
			// wx.showModal({
			//   title: '提示',
			//   content: '您已授权，赶紧将图片保存在相册中吧！',
			//   showCancel: false
			// })
			that.setData({
				openSettingBtnHidden: true
			})
		}
	},

	handleSelectImg() {
		if (this.data.select_img) {
			this.setData({
				box_url: ''
			})
		}
		wx.navigateTo({
			url: `../cropper/cropper`
		})
	},
	getCurrentDate(separator = "") {
		let date = new Date().getDate();
		let month = new Date().getMonth() + 1;
		let year = new Date().getFullYear();
		let hour = new Date().getHours(); //得到小时
		let minu = new Date().getMinutes(); //得到分钟
		let sec = new Date().getSeconds();
		return `${year}${month < 10 ? `0${month}` : `${month}`}${
			date < 10 ? `0${date}` : `${date}`
		}${hour < 10 ? `0${hour}` : `${hour}`}${separator}${
			minu < 10 ? `0${minu}` : `${minu}`
		}${separator}${sec < 10 ? `0${sec}` : `${sec}`}`;
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			item_url: options.item_url
		})
		// this.initWeCropper()
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
		setTimeout(() => {
			if (app.globalData.uploadImgSrc) {
				this.setData({
					select_img: app.globalData.uploadImgSrc
				})
				this.drawImage(this.data.select_img, this.data.item_url)
			}

		}, 2000);
		wx.hideLoading()
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