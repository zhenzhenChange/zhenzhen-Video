<template>
    <div id="Video">
        <el-row :gutter="20" class="mt-2">
            <el-col :span="12" :offset="6">
                <div class="grid-content bg-purple">
                    <el-tabs type="border-card">
                        <el-tab-pane class="text-center">
                            <span slot="label"><i class="el-icon-video-camera-solid"></i>视频传输</span>
                            <el-upload
                                    class="uploadVideo text-center style-upload"
                                    action="uploadVideoURL"
                                    drag
                                    :auto-upload="false"
                                    :on-change="checkVideoFormat"
                                    :on-progress="uploadProgress"
                                    :on-preview="clickFile"
                                    :on-remove="removeFile">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            </el-upload>
                            <el-row :gutter="12" class="mt-1">
                                <el-col :span="24">
                                    <el-card shadow="never">
                                        <span class="float-left pb-10 mt-10">异常检测</span>
                                        <span class="float-right pb-10 mt-8 font-size"
                                              :class="infoShow === '视频校验通过' ? 'green' : 'red'">
                                            {{infoShow}}
                                        </span>
                                    </el-card>
                                </el-col>
                            </el-row>
                            <el-progress
                                    class="mt-1"
                                    :text-inside="true"
                                    :stroke-width="24"
                                    status="success"
                                    :percentage="percentage"
                                    v-if="isProgressShow">
                            </el-progress>
                            <hr v-if="isProgressShow">
                            <p v-if="isProgressShow">上传成功后点击视频文件即可播放</p>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <div class="grid-content bg-purple text-center">
                                        <video
                                                :src="videoSrc"
                                                v-if="isVideoShow"
                                                controls
                                                width="620"
                                                height="440">
                                            您的浏览器不支持视频播放
                                        </video>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane>
                            <span slot="label"><i class="el-icon-setting"></i>设置</span>
                            <span class="h-32 mb-1">自定义视频格式</span><br>
                            <el-checkbox
                                    :indeterminate="isIndeterminate"
                                    v-model="checkAll"
                                    @change="checkAllFormat">
                                全选
                            </el-checkbox>
                            <div style="margin: 15px 0;"></div>
                            <el-checkbox-group
                                    v-model="defaultFormat"
                                    @change="CheckFormatChange">
                                <el-checkbox
                                        v-for="city in videoFormat"
                                        :label="city"
                                        :key="city">{{city}}
                                </el-checkbox>
                            </el-checkbox-group>
                            <hr>
                            <span class="h-32">自定义视频大小（单位：MB）</span>
                            <el-input-number
                                    class="float-right"
                                    v-model="size"
                                    :step="5"
                                    :max="500"
                                    size="small"></el-input-number>
                        </el-tab-pane>
                        <el-tab-pane>
                            <span slot="label"><i class="el-icon-help"></i>帮助</span>
                            <h3>视频传输</h3>
                            <div class="ml-2">
                                <p>
                                    1.点击上传视频（也可将视频文件拖到上传区域），会出现一个选择文件窗口，默认可以选择设置中选定类型的视频文件。
                                </p>
                                <p>
                                    2.选择好文件后点击打开，系统会自动校验视频的格式是否异常（超出指定大小或格式不正确）。
                                </p>
                                <p>
                                    3.如果有异常，则上传失败，反之上传成功。
                                </p>
                                <p>
                                    4.上传成功后会有一个文件列表，点击即可播放，也可以删除文件。
                                </p>
                                <p>
                                    5.注意：同一个文件只能上传一次。
                                </p>
                            </div>
                            <h3>设置</h3>
                            <div class="ml-2">
                                <p>
                                    1.自定义视频格式。
                                </p>
                                <p>
                                    2.自定义视频大小。
                                </p>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane class="text-center">
                            <span slot="label"><i class="el-icon-paperclip"></i>关于</span>
                            <h3>版本号：1.0 Beta</h3>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    const formatOptions = ['mp4', 'ogg', 'flv', 'avi', 'wmv', 'rmvb', 'mkv', 'mpeg', 'mov', 'f4v', 'm4v', 'rm', '3gp', 'dat', 'ts', 'mts', 'vob', 'x-matroska'];

    export default {
        name: "Video",
        data() {
            return {
                uploadVideoURL: '',     // 上传地址
                videoSrc: "",           // video标签的src属性
                srcList: [],            // 文件列表的各个文件地址
                videoList: "",          // 选取的文件列表
                isVideoShow: false,     // 控制video标签的显示状态
                isProgressShow: false,  // 控制进度条的显示状态
                percentage: 0,          // 进度条的百分比变化
                infoShow: '',           // 校验提示信息
                videoSize: false,       // 判断视频的大小
                checkAll: false,        //
                videoFormat: formatOptions,
                isIndeterminate: true,
                size: 300,
                defaultFormat: ['mp4', 'ogg', 'flv', 'avi', 'wmv', 'rmvb', 'mkv']
            };
        },
        methods: {
            // 1.选取视频时校验视频的格式及其大小
            checkVideoFormat(file, fileList) {
                // 1.1文件类型
                let fileType = file.raw.type;

                // 1.2文件类型简化（后缀名）
                let suffix = fileType.substring(fileType.indexOf('/') + 1);

                // 1.3判断文件的大小
                this.videoSize = file.size / 1024 / 1024 < this.size;

                // 1.4判断文件的类型
                if (!this.defaultFormat.includes(suffix)) {
                    // 1.4.1阻断文件插入列表
                    fileList.splice(-1, 1);
                    this.infoShow = `视频文件类型不正确！该文件的格式为：${suffix}`;
                    return;
                }

                // 1.5判断视频的大小
                if (!this.videoSize) {
                    fileList.splice(-1, 1);
                    this.infoShow = `文件大小不能超过${this.size}MB！该文件大小为：${(file.size / 1024 / 1024).toFixed(2)}MB`;
                    return;
                }

                // 判断该文件是否已在文件列表中
                /*
                    if (fileList.length === 0) {
                        return;
                        fileList.forEach(item => {
                            if (item.name === file.name) {
                                fileList.splice(-1, 1);
                                console.log(1);
                                return;
                            }
                        })
                    }
                */

                this.infoShow = `视频校验通过`;

                // 1.6调用进度条方法，传递文件的大小
                this.uploadProgress(parseInt(file.size / 100000));

                // 1.7创建文件读取对象
                let reader = new FileReader();

                // 1.8读取文件，获取DataURL。获取成功后自动存放在result中
                reader.readAsDataURL(file.raw);
                reader.onload = event => {
                    // 1.8.1将base64地址（DataURL）存入srcList数组
                    this.srcList.push({
                        fileName: file.name,
                        fileDataURL: event.target.result
                    });
                }
            },

            // 2.选择文件列表中的文件时处理函数
            clickFile(file) {
                // 2.1视频的地址更改为点击的文件的地址
                let srcIndex = "";
                let Srcs = [];
                Srcs = this.srcList.map((item, index) => {
                    if (file.name === item.fileName) {
                        srcIndex = index;
                        return item.fileDataURL;
                    }
                });

                this.videoSrc = Srcs[srcIndex];

                // 2.2当进度条100%后才可显示播放器
                if (this.percentage === 100) {
                    this.isVideoShow = true;
                }
            },

            // 3.进度条进度控制
            uploadProgress(fileSize) {
                // 3.1显示进度条
                this.isProgressShow = true;

                // 3.2清零
                this.percentage = 0;
                let timer = setInterval(() => {
                    // 3.2.1 以0.2倍速率递增
                    this.percentage += parseInt((fileSize - this.percentage) * .2);
                    if (this.percentage >= 100) {
                        clearInterval(timer);
                        this.percentage = 100;
                        return;
                    }
                }, 300);
            },

            // 4.判断文件列表是否为空，控制播放器和进度条的显示状态show
            removeFile(file, fileList) {
                if (fileList.length === 0) {
                    this.isVideoShow = false;
                    this.isProgressShow = false;
                }
            },

            // 5.全选视频格式
            checkAllFormat(value) {
                this.defaultFormat = value ? this.videoFormat : [];
                this.isIndeterminate = false;
            },

            // 6.将选取的格式存储到videoFormat数组（关联更新）
            CheckFormatChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.videoFormat.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.videoFormat.length;
            }
        },
        created() {
            // 通过生命周期绑定class ?
        }
    }
</script>

<style scoped>
    #app {
        font-family: Helvetica, sans-serif;
        text-align: center;
    }

    video {
        outline: none;
    }

    .mb-1 {
        margin-bottom: 10px;
    }

    .el-checkbox {
        width: 45px;
    }

    .font-size {
        font-size: 13px;
    }

    .mt-2 {
        margin-top: 20px;
    }

    .mt-1 {
        margin-top: 10px;
    }

    .ml-1 {
        margin-left: 10px;
    }

    .ml-2 {
        margin-left: 25px;
    }

    .mb-3 {
        margin-bottom: 30px;
    }

    .text-center {
        text-align: center;
    }

    .pb-10 {
        padding-bottom: 10px;
    }

    .mt-10 {
        margin-top: -10px;
    }

    .mt-8 {
        margin-top: -7px;
    }

    .float-left {
        float: left;
    }

    .float-right {
        float: right;
    }

    .red {
        color: red;
    }

    .green {
        color: green;
    }

    .h-32 {
        display: inline-block;
        height: 32px;
        line-height: 32px;
    }

    .style-upload /deep/ .el-upload-list--text {
        border: 1px solid gray;
        border-radius: 5px;
        padding-bottom: 9px;
        cursor: pointer;
    }

    .style-upload /deep/ .el-upload-list--text > .el-upload-list__item:hover {
        background-color: #b0b0b0;
    }
</style>