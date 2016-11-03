import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';
import uuid from 'node-uuid';

class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      currentUser: {name: "Anonymous"}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };

    this.sendMessageToServer = this.sendMessageToServer.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
  }

  componentDidMount () {
    console.log("componentDidMount <App />");
    this.socket = new WebSocket("ws://localhost:4000/"); // by using 'this' here, then 'socket' takes the scope of 'App' rather than 'componentDidMount'. if we didn't use 'this', then socket wouldn't be available throughout App.
    
    this.socket.onopen = (event) => {
      // NOTE: This function is a fat arrow function because you don't want to create a closure here (arrow functions allow you to retain the scope of the caller inside the function) - if you did, then when you called 'this' inside this function, it would point to scope created in this function and point to 'scope', rather than to the global scope of 'app'. 
      
      console.log("Connected to server!"); 

    };

    this.socket.onmessage = (event) => {
      // SET STATE!
      
      var message = JSON.parse(event.data);

      switch(message.type) {
        case "incomingMessage":
          // handle incoming message
          console.log("I got a message!!!", message)

          message.type = "userMessage"; // change the message type to scrub the 'type' message to/from the websocket server. Make these more meaningful for messageList, which shouldn't have to know about different server messages in order to render messages appropriately. Also, what happens if the user is being sent 'old' messages, not new incoming messages? Then using 'incomingMessage' in MessageList, they would miss the old messages.

          var messages = this.state.messages.concat(message); // use CONCAT instead of PUSH because with push, you are mutating the state!  If you change state without using setState, React won't know about it and won't update.
            // var messages = this.state.messages;
            // messages.push(message);

          this.setState({ messages: messages });

          break;
        case "incomingNotification":
    
          console.log("incomingNotification received!");

          message.type = "usernameChange"; // change the message type to scrub the messages to/from the websocket server. Make these more meaningful.

          var messages = this.state.messages.concat(message); 

          this.setState({ messages: messages });

          console.log("NOTIFICATION", message)

          break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + data.type);
      };
    } 
  }

  sendMessageToServer (message) {
    var newId = uuid.v4();
    var userName = this.state.currentUser;

    this.socket.send(JSON.stringify({ type: "postMessage", id: newId, username: userName.name, content: message }));

  }

  updateUsername (newUsername) {
    var newId = uuid.v4();
    
    let currUser = this.state.currentUser.name

    let message = JSON.stringify({ type: "postNotification", id: newId,content: currUser + " has changed their name to " + newUsername })
    
    this.setState({ currentUser: { name: newUsername } });

    this.socket.send(message);

  }

  render() {
    console.log("Rendering <App />");

    return (
      <div className="wrapper">
        <nav><h1>Chatty</h1></nav>
        <MessageList messages={this.state.messages} />
        <ChatBar currentUser={this.state.currentUser} onMessageCompleted={this.sendMessageToServer} usernameChanged={this.updateUsername} /> 
      </div>
    )
  }
}
export default App;
