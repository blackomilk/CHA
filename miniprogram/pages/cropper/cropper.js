//获取应用实例
const app = getApp()
Page({
    data: {
        src: '',
        width: 300, //宽度
        height: 300, //高度
        max_width: 300,
        quality: 1,
        max_height: 300,
        disable_rotate: true, //是否禁用旋转
        disable_ratio: false, //锁定比例
        limit_move: true, //是否限制移动
    },
    onLoad: function (options) {
        this.cropper = this.selectComponent("#image-cropper");
        this.setData({
            src: options.imgSrc
        });
        if (!options.imgSrc) {
            this.cropper.upload(); //上传图片
        }
    },
    cropperload(e) {
        console.log('cropper加载完成');
    },
    loadimage(e) {
        wx.hideLoading();
        // console.log('图片');
        this.cropper.imgReset();
    },
    clickcut(e) {
        // console.log(e.detail);
        //图片预览
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },
    upload() {
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
                that.cropper.imgReset();
                that.setData({
                    src: tempFilePaths
                });
            }
        })
    },
    setWidth(e) {
        this.setData({
            width: e.detail.value < 10 ? 10 : e.detail.value
        });
        this.setData({
            cut_left: this.cropper.data.cut_left
        });
    },
    setHeight(e) {
        this.setData({
            height: e.detail.value < 10 ? 10 : e.detail.value
        });
        this.setData({
            cut_top: this.cropper.data.cut_top
        });
    },
    switchChangeDisableRatio(e) {
        //设置宽度之后使剪裁框居中
        this.setData({
            disable_ratio: e.detail.value
        });
    },
    setCutTop(e) {
        this.setData({
            cut_top: e.detail.value
        });
        this.setData({
            cut_top: this.cropper.data.cut_top
        });
    },
    setCutLeft(e) {
        this.setData({
            cut_left: e.detail.value
        });
        this.setData({
            cut_left: this.cropper.data.cut_left
        });
    },
    switchChangeDisableRotate(e) {
        //开启旋转的同时不限制移动
        if (!e.detail.value) {
            this.setData({
                limit_move: false,
                disable_rotate: e.detail.value
            });
        } else {
            this.setData({
                disable_rotate: e.detail.value
            });
        }
    },
    switchChangeLimitMove(e) {
        //限制移动的同时锁定旋转
        if (e.detail.value) {
            this.setData({
                disable_rotate: true
            });
        }
        this.cropper.setLimitMove(e.detail.value);
    },
    switchChangeDisableWidth(e) {
        this.setData({
            disable_width: e.detail.value
        });
    },
    switchChangeDisableHeight(e) {
        this.setData({
            disable_height: e.detail.value
        });
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
    submit() {
        this.cropper.getImg((obj) => {
            // app.globalData.imgSrc = obj.url;
            // console.log(obj)
            wx.showLoading({
                title: '上传中',
            })
            let c = this.getCurrentDate()
            wx.cloud.uploadFile({
                cloudPath: `${c}.png`,
                filePath: obj.url, // 文件路径
                success: res => {
                    // console.log(res)
                    wx.cloud.getTempFileURL({
                        fileList: [{
                            fileID: res.fileID,
                            maxAge: 60 * 60, // one hour
                        }]
                    }).then(res => {
                        app.globalData.uploadImgSrc = res.fileList[0].tempFileURL
                        wx.showLoading({
                            title: '努力剪切中',
                        })
                    }).catch(error => {
                        // handle error
                    })
                },
                fail: err => {
                    // handle error
                }
            })
            wx.navigateBack({
                delta: -1
            })
        });
    },
    rotate() {
        //在用户旋转的基础上旋转90°
        this.cropper.setAngle(this.cropper.data.angle += 90);
    },
    top() {
        this.data.top = setInterval(() => {
            this.cropper.setTransform({
                y: -3
            });
        }, 1000 / 60)
    },
    bottom() {
        this.data.bottom = setInterval(() => {
            this.cropper.setTransform({
                y: 3
            });
        }, 1000 / 60)
    },
    left() {
        this.data.left = setInterval(() => {
            this.cropper.setTransform({
                x: -3
            });
        }, 1000 / 60)
    },
    right() {
        this.data.right = setInterval(() => {
            this.cropper.setTransform({
                x: 3
            });
        }, 1000 / 60)
    },
    narrow() {
        this.data.narrow = setInterval(() => {
            this.cropper.setTransform({
                scale: -0.02
            });
        }, 1000 / 60)
    },
    enlarge() {
        this.data.enlarge = setInterval(() => {
            this.cropper.setTransform({
                scale: 0.02
            });
        }, 1000 / 60)
    },
    end(e) {
        clearInterval(this.data[e.currentTarget.dataset.type]);
    },
})