const app = new Vue({
  el: '#app',
  data: {
   title: 'ChuckChat',
   name: '',
   text: '',
   messages: [],
   healthUpdates: [],
   socket: null
  },
  methods: {
   sendMessage() {
    if(this.validateInput()) {
     const message = {
     name: this.name,
     text: this.text
    }
    this.socket.emit('msgToServer', message)
    this.text = ''
   }
  },
  receivedMessage(message) {
   this.messages.push(message)
  },
  receivedUpdate(message) {
    console.log(message);
    this.healthUpdates.push(message)
   },
  validateInput() {
   return this.name.length > 0 && this.text.length > 0
  }
 },
  created() {
   this.socket = io('http://localhost:3000')
   this.socket.on('msgToClient', (message) => {
    this.receivedMessage(message)
   });
   this.socket.on('healthUpdate', (message) => {
    this.receivedUpdate(message)
   });
  }
 })