<template>
  <div class="image-body">
    <div class="image-div">
      <ElImage class="image-bk" :src="bkImage"></ElImage>
      <ElImage
        :style="{ marginLeft: marginLeft + 'px' }"
        class="image-slide"
        :src="slideImage"
      ></ElImage>
    </div>
    <div class="image-slide-div">
      <div class="image-slide-text">
        <span class="image-slide-tips">
          {{ showTips ? "向右拖动滑块填充拼图" : "&nbsp;" }}
        </span>
      </div>
      <div :style="slideStyle" class="slide-div">
        <ElButton
          :style="slideButtonStyle"
          @mousedown="handleDrag"
          class="slide-button"
          :round="false"
          type="primary"
          plain
        >
          <template #icon>
            <Right v-if="result === 'default'" />
            <Check v-if="result === 'success'" />
            <Close v-if="result === 'error'" />
          </template>
        </ElButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, computed, reactive } from "vue";
import { getSlideImage, verifyCodeCheck } from "@/assets/api/api";
import { ElImage, ElIcon, ElButton } from "element-plus";
import { Right, Check, Close } from "@element-plus/icons-vue";
export default defineComponent({
  components: { ElImage, ElIcon, Right, Check, Close, ElButton },
  setup() {
    //验证码背景图片
    const bkImage = ref("");
    //验证码滑块图片
    const slideImage = ref("");
    //是否显示提示文字
    const showTips = ref(true);
    //验证码滑块图片移动量
    const marginLeft: any = ref(0);
    //验证码状态
    const result: any = ref("default");
    //滑动背景样式
    let slideStyleJson: any = reactive({});
    //滑块按钮样式
    let slideButtonStyleJson: any = reactive({});
    const slideStyle = computed(() => {
      return slideStyleJson;
    });
    const slideButtonStyle = computed(() => {
      return slideButtonStyleJson;
    });

    function loadImage() {
      getSlideImage().then((res: any) => {
        bkImage.value = "data:image/png;base64," + res.bkImage;
        slideImage.value = "data:image/png;base64," + res.slideImage;
      });
    }
    /**
     * 改变拖动时改变
     */
    function dragChangeSildeStyle() {
      slideStyleJson.background = "rgba(25,145,250,0.5)";
      slideStyleJson.transition = null;
      slideButtonStyleJson.transition = null;
    }
    /**
     * 验证成功
     */
    function handleSuccess() {
      result.value = "success";
      slideStyleJson.background = "#d2f4ef";
      slideButtonStyleJson["background"] = "#52ccba";
      slideButtonStyleJson["color"] = "white";
      slideButtonStyleJson["border"] = "1px solid #52ccba";
    }
    /**
     * 验证失败
     */
    function handleError() {
      result.value = "error";
      slideStyleJson.background = "rgba(245,122,122,0.5)";
      slideButtonStyleJson["background"] = "#f57a7a";
      slideButtonStyleJson["color"] = "white";
      slideButtonStyleJson["border"] = "1px solid #f57a7a";
      setTimeout(() => {
        handleReset();
      }, 300);
    }
    /**
     * 重置验证码
     */
    function handleReset() {
      result.value = "default";
      marginLeft.value = 0;
      slideStyleJson.width = "0px";
      slideButtonStyleJson.marginLeft = "0px";
      slideButtonStyleJson.color = null;
      slideButtonStyleJson.border = null;
      slideButtonStyleJson.background = null;
      slideStyleJson.transition = "width 0.5s";
      slideButtonStyleJson.transition = "margin-left 0.5s";
      showTips.value = true;
      loadImage();
    }

    onMounted(() => {
      loadImage();
    });
    //添加移动事件
    function handleDrag(c: any) {
      let clickX = c.clientX;
      dragChangeSildeStyle();
      showTips.value = false;
      document.onmousemove = function (e: any) {
        let moveX = e.clientX;
        let offset: any = moveX - clickX;
        if (offset < 0) {
          offset = 0;
        } else if (offset > 250) {
          offset = 250;
        }
        let slidePadding: any = (offset / 25).toFixed(0);
        let slideDivOffset = offset + parseInt(slidePadding) + "px";
        slideStyleJson.width = slideDivOffset;
        slideButtonStyleJson.marginLeft = slideDivOffset;
        marginLeft.value = offset;
      };
      document.onmouseup = async function () {
        document.onmousemove = null;
        document.onmouseup = null;
        //校验验证码
        const res:any = await verifyCodeCheck({ offset: marginLeft.value });
        if (res) {
          //成功
          handleSuccess();
        } else {
          //失败
          handleError();
        }
      };
    }
    return {
      loadImage,
      bkImage,
      slideImage,
      marginLeft,
      Right,
      Close,
      Check,
      handleDrag,
      slideStyle,
      slideButtonStyle,
      result,
      showTips,
    };
  },
});
</script>
<style lang="less" scoped>
.image-body {
  margin: 0 auto;
  width: 300px;
  .image-div {
    width: 300px;
    height: 150px;
    background: rgb(153, 216, 197);
    .image-bk {
      width: 300px;
      height: 150px;
      z-index: 1;
      position: absolute;
    }
    .image-slide {
      width: 50px;
      height: 150px;
      position: absolute;
      z-index: 2;
    }
  }
  .image-slide-div {
    width: 300px;
    height: 38px;
    margin-top: 15px;
    position: relative;
    .image-slide-text {
      background: #f7f9fa;
      border: 1px solid #ebebeb;
      .image-slide-tips {
        font-size: 14px;
        line-height: 38px;
        text-align: center;
      }
    }
    .slide-div {
      width: 0px;
      height: 38px;
      margin-top: -39px;
      .slide-button {
        width: 40px;
        height: 38px;
        border: none;
        border-left: 1px solid;
        border-right: 1px solid;
        border-color: #ebebeb;
        background: white;
        cursor: pointer;
        &:hover {
          background: #1991fa;
          border-color: #1991fa;
          color: white;
        }
      }
    }
  }
}
</style>
