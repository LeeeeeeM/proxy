import Lite from './framework/index'

const a = new Lite({
  data() {
    return {
      count: 100,
      option: {
        count: 1
      },
      content: '我是显示的内容',
      sShow: false,
      info: {
        name: 'slm',
        age: 100
      }
    }
  },
  template: `
    <div name="{{info.name}}">
      <div><span>{{count}}</span></div>
      <div><input type="button" value="点击增加根组件count" @click="addOnce"/></div>   
      <div><span>{{info.name}}</span></div>
      <div><input type="text" value="{{info.name}}" disabled /></div>
      <div><span>count :{{option.count}}</span></div>
      <div><input type="button" value="点击option.count增加多次" @click="add"/></div>
      <div><input type="button" value="{{ sShow ? '隐藏' : '显示'}}" @click="show"/></div>
      <div if="{{sShow}}" uuu="ooo">
        <span>{{content}}</span>
      </div>
    </div>`,
  el: '#app',
  mounted() {
    console.log(`挂载成功`)
  },
  methods: {
    add() {
      this.option.count++
      this.option.count++
      this.option.count++
    },
    addOnce() {
      this.count++
    },
    show() {
      this.sShow = !this.sShow
    }
  }
})

setTimeout(() => {
  a.info.name = 123
}, 1000)

setTimeout(() => {
  a.info.age = 123
}, 2000)

setTimeout(() => {
  a.option = {
    count: 1000
  }
})