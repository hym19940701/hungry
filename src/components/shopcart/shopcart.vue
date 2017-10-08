<template>
  <div class="shopcart-wrapper">
    <div class="shopcart">
      <div class="footer-content" @click="toggleList">
        <div class="content-left">
          <div class="logo-warpper">
            <div class="logo" :class="{'highlight':num>0}"><i class="icon-shopping_cart"></i></div>
            <div class="num" v-show="num>0">{{num}}</div>
          </div>
          <div class="price" :class="{'highlight':num>0}">&yen;{{totalPrice}}</div>
          <div class="desc">另需配送费&yen;{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="{'enough':totalPrice>= minPrice}">{{payDesc}}</div>
        </div>
      </div>
      <!-- 运动的小球 -->
      <div class="ball-wrapper">
        <div v-for="ball in getBalls">
          <transition name="drop" @before-enter="beforDrop" @enter="droping"
                      @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header"><h1 class="title">购物车</h1><span class="empty">清空</span></div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border" v-for="food in cartProducts">
                <span class="name">{{food.name}}</span>
                <div class="price"><span>&yen;{{food.price}}</span></div>
                <div class="cartcontrol-warpper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hidelist"></div>
    </transition>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import IScroll from 'iscroll'

  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapGetters(['cartProducts', 'getBalls']),
      num () {
        let count = 0
        this.cartProducts.forEach((item) => {
          count += item.count
        })
        return count
      },
      totalPrice() {
        let total = 0
        this.cartProducts.forEach((item) => {
          total += item.count * item.price
        })
        return total
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差¥${diff}元起送`
        } else {
          return '去结算'
        }
      },
      listShow() {
        if (!this.num) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new IScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    data() {
      return {
        fold: true
      }
    },
    methods: {
      toggleList() {
        if (!this.num) {
          return
        }
        this.fold = !this.fold
      },
      hidelist() {
        this.fold = true
      },
      ...mapMutations({dropEnd: 'DROP_END'}),
      beforDrop(el) {
        let count = this.getBalls.length
        while (count--) {
          let ball = this.getBalls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 26 // 红球x轴偏移量
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.transform = `translate3D(0,${y}px,0)`
            el.style.webkitTransform = `translate3D(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.transform = `translate3D(${x}px,0,0)`
            inner.style.webkitTransform = `translate3D(${x}px,0,0)`
          }
        }
      },
      droping(el, done) {
//        console.log(done)
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight // 强制页面重绘
        this.$nextTick(() => {
          el.style.display = ''
          el.style.transform = `translate3D(0,0,0)`
          el.style.webkitTransform = `translate3D(0,0,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.transform = `translate3D(0,0,0)`
          inner.style.webkitTransform = `translate3D(0,0,0)`
          // 完成过渡后触发
          el.addEventListener('transitionend', done)
        })
      },
      afterDrop(el) {
        this.dropEnd({el})
      }
    },
    components: {
      cartcontrol
    }
  }
</script>

<style lang="less" scoped>
  @import "../../common/less/mixin";

  .shopcart {
    position: fixed;
    height: 48px;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 50;
    .footer-content {
      display: flex;
      background: #141d27;
      font-size: 0;
      .content-left {
        flex: 1;
        .logo-warpper, .price, .desc {
          display: inline-block;
        }
        .logo-warpper {
          position: relative;
          top: -10px;
          z-index: 55;
          margin: 0 6px;
          padding: 6px;
          width: 56px;
          height: 56px;
          box-sizing: border-box;
          border-radius: 50%;
          vertical-align: top;
          background: #141d27;
          .logo {
            width: 100%;
            height: 100%;
            line-height: 44px;
            border-radius: 50%;
            text-align: center;
            font-size: 24px;
            color: rgba(255, 255, 255, 0.4);
            background: #2C353D;
            &.highlight {
              background: rgb(0, 160, 220);
              color: #fff;
            }
          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 12px;
            font-size: 9px;
            color: #fff;
            background: rgb(240, 20, 20);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }
        .price {
          margin: 12px 0;
          padding-right: 12px;
          line-height: 24px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 16px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          &.highlight {
            color: #fff;
          }
        }
        .desc {
          margin: 12px 0;
          padding-left: 12px;
          font-size: 10px;
          line-height: 24px;
          color: rgba(255, 255, 255, 0.4);
        }
      }
      .content-right {
        flex: 0 0 105px;
        width: 105px;
        background: #2C343C;
        .pay {
          padding: 0 8px;
          height: 48px;
          line-height: 48px;
          font-size: 14px;
          font-weight: 700;
          text-align: center;
          color: rgba(255, 255, 255, 0.4);
          &.enough {
            background: #55DA6C;
            color: #fff;
          }
        }
      }
    }

    .ball-wrapper {
      .ball {
        position: fixed;
        left: 26px;
        bottom: 22px;
        z-index: 200;
        transition: all 0.4s cubic-bezier(0.45, -0.30, 0.75, 0.41);
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(240, 20, 20);
          transition: all 0.4s;
        }
      }
    }

    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: -1;
      transition: all 0.5s;
      transform: translate3D(0, -100%, 0);
      &.fold-enter, &.fold-leave-active {
        opacity: 0;
        transform: translate3D(0, 0, 0);
      }
      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title {
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 260);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background: #fff;
        .food {
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          .border-1px(rgba(7, 17, 27, 0.1));
          .name {
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: 85px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          }
          .cartcontrol-warpper {
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
      }
    }
  }

  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);
    transition: all 0.5s;
    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      background: rgba(7, 17, 27, 0);;
    }
  }

</style>
