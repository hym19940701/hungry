/**
 * Created by newuser on 2017/9/13.
 */
import * as types from '../mutation-types'
const state = {
  added: [],
  balls: [
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    },
    {
      show: false
    }],
  dropBalls: []
}

const getters = {
  cartProducts: state => state.added,
  getBalls: state => state.balls
}

const mutations = {
  [types.DROP_START](state, {el}) {
    for (let i = 0; i < state.balls.length; i++) {
      let ball = state.balls[i]
      if (!ball.show) {
        ball.show = true
        ball.el = el
        state.dropBalls.push(ball)
        return
      }
    }
  },
  [types.DROP_END](state, {el}) {
    let ball = state.dropBalls.shift()
    if (ball) {
      ball.show = false
      // 把小球的css样式设置为none
      el.style.display = 'none'
    }
  }
}

export default {
  state,
  getters,
  mutations
}
