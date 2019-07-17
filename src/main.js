import Lite from './framework/index'

const a = new Lite({
  data() {
    return {
      xx: 1,
      info: {
        name: 'slm'
      }
    }
  },
  template: `<div name="{{xx}}"><span>{{info.name}}</span><span>{{info.name}}</span><span>{{info.name}}</span><input type="text" value="{{info.name}}" /></div>`,
  el: '#app'
})

setTimeout(() => {
  a.$data.info.name = 123
}, 1000)
