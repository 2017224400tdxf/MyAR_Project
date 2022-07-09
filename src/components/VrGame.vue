<template>
  <div>
  <el-container>
    <el-header class="header"> 
      <div class="font">
        Turn your <b>Web Camera</b> into a controller using a <b>Neural Network</b>.
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <div class="image">
          <div id="logo-1" v-show="isShow2">
          </div> 
          <div id="logo-2" v-show="isShow3">
          </div>
          <div id="logo-3" v-show="isShow1">
          </div>
          <div id="logo-4" v-show="isShow4">
          </div>
        </div>
      </el-aside>
      <el-main>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
                <!-- Hyper params.hidden -->
                <el-card class="box-card">
                  <el-button type="primary" @click="edit()">Camera</el-button>
                  <el-button type="primary" @click="trainModel()">TRAIN MODEL</el-button>
                  <el-button type="primary" @click="showToggle()">PLAY</el-button>
                  <!-- Learning rate -->
                  <p>
                  </p>
                  <p>
                  </p>
                  <div id="wrap">
                    <div>
                      <div class="dropdown">
                        <label>Learning rate</label>
                        <div class="select">
                          <el-select v-model="value" placeholder="Please select." size="mini">
                            <el-option
                              v-for="item in options_rate"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>

                      <!-- Batch size -->
                      <div class="dropdown">
                        <label>Batch size</label>
                        <div class="select">
                          <el-select v-model="value" placeholder="Please select." size="mini">
                            <el-option
                              v-for="item in options_batch"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>

                      <!-- Epochs -->
                      <div class="dropdown">
                        <label>Epochs</label>
                        <div class="select">
                          <el-select v-model="value" placeholder="Please select." size="mini">
                            <el-option
                              v-for="item in options_epochs"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>

                      <!-- Hidden units -->
                      <div class="dropdown">
                        <label>Hidden units</label>
                        <div class="select">
                          <el-select v-model="value" placeholder="Please select." size="mini">
                            <el-option
                              v-for="item in options_units"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </div>
                      </div>
                    </div>
                    <div class="end">
                    {{text}}
                    </div>
                    <div class="webcam-box-outer">
                      <div class="webcam-box-inner">
                        <video ref="video" autoplay playsinline muted id="webcam" width="224" height="224"></video>
                      </div>
                    </div>
                  </div>
                </el-card>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-row>
                  <el-col :span="8"><div class="grid-content"></div></el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <div class="thumb-box-outer">
                        <div class="thumb-box-inner">
                          <canvas ref="canvas" class="thumb" width=20 height=10 id="up-thumb"></canvas>
                        </div>
                        <el-button type="primary" @click="captureSample(0)">Add Sample</el-button>
                      </div>
                      <p>
                          <span id="up-total">{{count1}}</span> up examples
                      </p>
                    </div>
                  </el-col>
                  <el-col :span="8"><div class="grid-content"></div></el-col>
              </el-row>
              <el-row class="test">
                  <el-col :span="8" >
                    <div class="grid-content bg-purple">
                      <div class="thumb-box-outer">
                        <div class="thumb-box-inner">
                          <canvas ref="canvas" class="thumb" width=20 height=10 id="left-thumb"></canvas>
                        </div>
                        <el-button type="primary" @click="captureSample(1)">Add Sample</el-button>
                      </div>
                      <p>
                          <span id="left-total">{{count2}}</span> left examples
                      </p>
                    </div>
                  </el-col>
                  <el-col :span="8"><div class="grid-content"></div></el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <div class="thumb-box-outer">
                        <div class="thumb-box-inner">
                          <canvas ref="canvas" class="thumb" width=20 height=10 id="right-thumb"></canvas>
                        </div>
                        <el-button type="primary" @click="captureSample(2)">Add Sample</el-button>
                      </div>
                      <p>
                          <span id="right-total">{{count3}}</span> right examples
                      </p>
                    </div>
                  </el-col>
              </el-row>
              <el-row>
                  <el-col :span="8"><div class="grid-content"></div></el-col>
                  <el-col :span="8">
                    <div class="grid-content bg-purple">
                      <div class="thumb-box-outer">
                        <div class="thumb-box-inner">
                          <canvas ref="canvas" class="thumb" width=20 height=15 id="down-thumb"></canvas>
                        </div>
                        <el-button type="primary" @click="captureSample(3)">Add Sample</el-button>
                      </div>
                      <p>
                          <span id="down-total">{{count4}}</span> down examples
                      </p>
                    </div>
                  </el-col>
                  <el-col :span="8"><div class="grid-content"></div></el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
  var vid;
  var constraints = (constraints = {
          audio:false,
          video:true
          });
  let trainingData = [];
  let hasTrained = false;
  const labels = ["up", "left", "right", "down"];
  import * as tf from '@tensorflow/tfjs';
  import * as tfd from '@tensorflow/tfjs-data';
  export default {
    data() {
      return {
        count1:0,
        count2:0,
        count3:0,
        count4:0,
        text:"",
        id:0,
        model :null,
        isShow1:false,
        isShow2:false,
        isShow3:false,
        isShow4:false,
        options_rate: [{
          value: '选项1',
          label: '0.00001'
        }, {
          value: '选项2',
          label: '0.0001'
        }, {
          value: '选项3',
          label: '0.001'
        }, {
          value: '选项4',
          label: '0.003'
        }],
        options_batch: [{
          value: '选项1',
          label: '0.05'
        }, {
          value: '选项2',
          label: '0.1'
        }, {
          value: '选项3',
          label: '0.4'
        }, {
          value: '选项4',
          label: '1'
        }],
        options_epochs: [{
          value: '选项1',
          label: '10'
        }, {
          value: '选项2',
          label: '20'
        }, {
          value: '选项3',
          label: '40'
        }],
        options_units: [{
          value: '选项1',
          label: '10'
        }, {
          value: '选项2',
          label: '100'
        }, {
          value: '选项3',
          label: '200'
        }]
      }
    },
    methods:{
        showToggle:function(){
          //显示当前的E的方向
          var num=Math.floor(Math.random() * (5 - 1)) + 1;
          this.isShow1=false;
          this.isShow2=false;
          this.isShow3=false;
          this.isShow4=false;
          if(num==1){
            this.isShow1 = !this.isShow1;
          }
          if(num==2){
            this.isShow2 = !this.isShow2;
          }
          if(num==3){
            this.isShow3 = !this.isShow3;
          }
          if(num==4){
            this.isShow4 = !this.isShow4;
          }
          //用训练好的模型预测当前方向
          this.predictImage()
          //判断当前E的方向与姿势图片是否一致
          if(this.id+1==num){
            this.text="Perfect!"
            console.log("Perfect!");
          }
          else{
            this.text="Game Over!"
            console.log("Game Over!");
          }
        },
        createTransferModel( model ) {
            // Create the truncated base model (remove the "top" layers, classification + bottleneck layers)
            const bottleneck = model.getLayer( "dropout" ); // This is the final layer before the conv_pred pre-trained classification layer
            const baseModel = tf.model({
                inputs: model.inputs,
                outputs: bottleneck.output
            });
            // Freeze the convolutional base
            for( const layer of baseModel.layers ) {
                layer.trainable = false;
            }
            // Add a classification head
            const newHead = tf.sequential();
            newHead.add( tf.layers.flatten( {
                inputShape: baseModel.outputs[ 0 ].shape.slice( 1 )
            } ) );
            newHead.add( tf.layers.dense( { units: 100, activation: 'relu' } ) );
            newHead.add( tf.layers.dense( { units: 100, activation: 'relu' } ) );
            newHead.add( tf.layers.dense( { units: 10, activation: 'relu' } ) );
            newHead.add( tf.layers.dense( {
                units: labels.length,
                kernelInitializer: 'varianceScaling',
                useBias: false,
                activation: 'softmax'
            } ) );
            // Build the new model
            const newOutput = newHead.apply( baseModel.outputs[ 0 ] );
            const newModel = tf.model( { inputs: baseModel.inputs, outputs: newOutput } );
            return newModel;
        },
        async trainModel() {
            hasTrained = false;
            console.log("Training...");
            this.model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
            this.model = this.createTransferModel( this.model )
            // Setup training data
            const imageSamples = [];
            const targetSamples = [];
            trainingData.forEach( sample => {
                imageSamples.push( sample.image );
                let cat = [];
                for( let c = 0; c < labels.length; c++ ) {
                    cat.push( c === sample.category ? 1 : 0 );
                }
                targetSamples.push( tf.tensor1d( cat ) );
            });
            const xs = tf.stack( imageSamples );
            const ys = tf.stack( targetSamples );
 
            // Train the model on new image samples
            this.model.compile( { loss: "meanSquaredError", optimizer: "adam", metrics: [ "acc" ] } );
 
            await this.model.fit( xs, ys, {
                epochs: 30,
                shuffle: true,
                callbacks: {
                    onEpochEnd: ( epoch, logs ) => {
                        console.log( "Epoch #", epoch, logs );
                    }
                }
            });
            hasTrained = true;
        },
        async setupWebcam() {
            return new Promise( ( resolve, reject ) => {
                const webcamElement = document.getElementById( "webcam" );
                const navigatorAny = navigator;
                navigator.getUserMedia = navigator.getUserMedia ||
                navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
                navigatorAny.msGetUserMedia;
                if( navigator.getUserMedia ) {
                    navigator.getUserMedia( { video: true },
                        stream => {
                            webcamElement.srcObject = stream;
                            webcamElement.addEventListener( "loadeddata", resolve, false );
                        },
                    error => reject());
                }
                else {
                    reject();
                }
            });
        },
        async getWebcamImage() {
            await this.setupWebcam();
            const webcam = await tf.data.webcam(document.getElementById( "webcam" ));
            const img = ( await webcam.capture() ).toFloat();
            const normalized = img.div( 127 ).sub( 1 );
            return normalized;
        },
        async captureSample( category ) {
            const image1=await this.getWebcamImage();
            trainingData.push( {
                image: image1,
                category: category
            });
            if(category==0){
            this.count1+=1;
            }
            if(category==1){
            this.count2+=1;
            }
            if(category==2){
            this.count3+=1;
            }
            if(category==3){
            this.count4+=1;
            }
            this.drawThumb(image1,category);
            console.log("Captured: "+labels[ category ]);
        },
        async predictImage(){
          //调用已经训练好的模型
          //获得当前摄像头的图片，预测姿势的方向
          await this.setupWebcam();
          const webcam1 = await tf.data.webcam(document.getElementById( "webcam" ));
          if( !hasTrained ) { return; }
          const img = ( await webcam1.capture() ).toFloat();
          const normalized = img.div( 127 ).sub( 1 );
          let result = tf.tidy( () => {
              const input = normalized .reshape( [ 1, 224, 224, 3 ] );
              return this.model.predict( input );
          });
          normalized.dispose();
          let prediction = await result.data();
          console.log(prediction)
          result.dispose();
          // Get the index of the highest value in the prediction
          this.id = prediction.indexOf(Math.max( ...prediction ) );
          console.log(labels[this.id]);
          //const activation = mobilenet.predict(img);
          //const logits = model.predict(activation);
          //console.log(logits)
        },
        handleSuccess(stream){
          //摄像头开始成功
          console.log(stream)
          vid.srcObject=stream;
          vid.play();

        },
        //调用摄像头
        edit:function(display) {
          vid=document.querySelector("video")
          navigator.mediaDevices.getUserMedia(constraints)
          .then(this.handleSuccess)
       },
        //拍照，这个不清晰
        photograph() {
        // 把当前视频帧内容渲染到canvas上
        let ctx = this.$refs["canvas"].getContext("2d");
        ctx.drawImage(this.$refs["video"],0,0,20,20);
        },
        drawThumb(img, label) {
            const thumbCanvas = document.getElementById(labels[label] + '-thumb');
            this.draw(img, thumbCanvas);
        },
        draw(image, canvas) {
          const [width, height] = [224, 224];
          const ctx = canvas.getContext('2d');
          const imageData = new ImageData(width, height);
          const data = image.dataSync();
          for (let i = 0; i < height * width; ++i) {
            const j = i * 4;
            imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
            imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
            imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
            imageData.data[j + 3] = 255;
          }
          ctx.putImageData(imageData, 0, 0);
        }
        
  }
  }
</script>

<style scoped>
.font{
  background-color: #ef6c00;
  border-bottom: solid 1px rgba(0,0,0,0.4);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  color: rgba(255, 255, 255, 0.8);
  font-size: 30px;
  font-weight: 300;
  line-height: 1.45em;
  overflow: hidden;
  padding: 20px 0;
  position: relative;
  text-align: center;
  -webkit-font-smoothing: antialiased;
}
.box-card {
    width: 445px;
    height:540px;
    position:absolute;
  }
 .el-row {
    margin-bottom: 10px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    margin-top:10px;
    margin-left:0px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .thumb-box-outer {
  background: black;
  border: 1px solid #585858;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  padding: 5px;
  position: relative;
  transition: box-shadow 0.3s;
  
}
.thumb-box-inner {
  border: 1px solid #585858;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 66px;
}
.thumb {
  height: 60px;
  transform: scaleX(-1);
}
.dropdown {
  flex-direction: column;
  width: 110px;
  margin-bottom: 50px;
}
.end{
  margin-top:50px;
  margin-left:-10px;
}
.webcam-box-outer {
  background: black;
  border: 1px solid #585858;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  padding: 9px;
  height:183px;
  margin-top:100px;
  
}
.webcam-box-inner {
  border: 1px solid #585858;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  overflow: hidden;
  width: 160px;
}
#webcam {
  height: 160px;
  transform: scaleX(-1);
}
#wrap{
    display: flex;
    justify-content: space-around;
}
#logo-1 {
  border: 2px solid #F56C6C;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  padding: 9px;
  height: 70px;
  width: 70px;
  margin-right:23px;
  margin-top:-7px;
}
#logo-2 {
  border: 2px solid #F56C6C;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  padding: 9px;
  height: 60px;
  width: 60px;
  margin-right:93px;
  margin-bottom:-113px;
}
#logo-3 {
  border: 2px solid #F56C6C;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  padding: 9px;
  height: 50px;
  width: 50px;
  margin-right:95px;
  margin-bottom:-168px;
  
}
#logo-4 {
  border: 2px solid #F56C6C;
  border-radius: 4px;
  box-sizing: border-box;
  display: inline-block;
  padding: 9px;
  height: 40px;
  width: 40px;
  margin-right:25px;
  margin-bottom:-215px;
  
}
.image{
  width: 300px;
	height: 490px;
  background:url('~@/../static/eyes.png')center center no-repeat;
  background-size: 175px auto;
  margin-top:50px;
  margin-left:-20px;
}

</style>