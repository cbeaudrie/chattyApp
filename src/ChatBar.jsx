import React, {Component} from 'react';

class ChatBar extends Component {
  constructor (props) {
    super(props);
    this.state = {value: ''}; // Be sure to initialize here or it won't work!
    this.inputChange = this.inputChange.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
  }

  componentDidMount() {
    console.log("Display componentDidMount ChatBar")
  }

  inputChange(event) {
    console.log("letter entered in box") 
    this.setState({value: event.target.value});  
  }

  handleEvent(event) {
    console.log("in handleEvent")

    event.preventDefault();

    if (event.key === 'Enter') {
      this.props.someFunction(event.target.value);
      this.setState({value:''}); // Resets the text box
    }

    // this.setState({value: event.target.value});  

    // message = {value: event.target.value};

    // this.props.someFunction

    // console.log(event.target.value)
    // someFunction(message);
    // 
    // handleEvent(event) {
    //  event.preventDefault()
    //    this.props.handleUserMessage(event.target.submitbutton.value);
    //    }
    // 
    // 
    // event.preventDefault()
    //    this.props.handleUserMessage(event.target.submitbutton.value); //????

  }

  render() {
    console.log("Rendering <ChatBar />");
    // debugger

    return (

      <footer>
        <input id="username" type="text" placeholder="Your Name (Optional)" value={this.props.currentUser.name} />
        <input 
          id="new-message" 
          type="text" 
          placeholder="Type a message and hit ENTER" 
          value={this.state.value} 
          onChange={this.inputChange}
          onKeyUp={this.handleEvent} /> 
      </footer>
      // NOTE: need to use 'onKeyUp' in the form submission above - onSubmit does not work for a form if there is no 'submit' button

      // <App .../>

    );
  }
}
export default ChatBar;