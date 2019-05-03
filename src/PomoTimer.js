import React from 'react';
import ReactNotifications from 'react-browser-notifications';

class PomoTimer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      time: 25*60,
      start: 25*60,
      isRunning: false,
      tasks: ["test", "test2"]
    }
    this.startTimer = this.startTimer.bind(this)
    this.pauseTimer = this.pauseTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.setPomodoro = this.setPomodoro.bind(this)
    this.setShortBreak = this.setShortBreak.bind(this)
    this.setLongBreak = this.setLongBreak.bind(this)
    this.showNotifications = this.showNotifications.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.addTask = this.addTask.bind(this);
  }
 
  showNotifications() {
    if(this.n.supported()) this.n.show();
  }
 
  handleNotificationClick(event) {
    window.focus();
    this.n.close(event.target.tag);
  }
  startTimer() {
    if(!this.state.isRunning) {

      this.setState({
        isRunning: true,
      })
      this.timer = setInterval(() => this.setState({
        time: this.state.time - 1
      }), 1);
    }
  }
  pauseTimer() {
    this.setState({isRunning: false})
    clearInterval(this.timer)
  }
  resetTimer() {
    this.setState({time: this.state.start, isRunning: false})
    clearInterval(this.timer)
  }
  setPomodoro() {
    this.setState({time: 25*60, start: 25*60, isRunning: false})
    clearInterval(this.timer)
  }
  setShortBreak() {
    this.setState({time: 5*60, start: 5*60, isRunning: false})
    clearInterval(this.timer)
  }
  setLongBreak() {
    this.setState({time: 15*60, start: 15*60, isRunning: false})
    clearInterval(this.timer)
  }
  addTask(e) {
    e.preventDefault();

    var newTask = this.refs.taskName.value;
    this.refs.taskForm.reset();
    this.state.tasks.push(newTask);
    this.setState({tasks: this.state.tasks})
  }

  processTime(time) {
    if (time > 0) {

      var minutes = Math.floor(time / 60);
      var seconds = Math.floor(time % 60);
      if(seconds < 10) {
        seconds = "0" + seconds;
      }
      return minutes+":"+seconds;
    } else {
      clearInterval(this.timer)
      this.showNotifications();
      //Do a notification
      return "0:00";
    }
  }
  
  render() {
    return (
        <div>
            <ReactNotifications
              onRef={ref => (this.n = ref)} // Required
              title="Pomodoro" // Required
              body={"Your " + this.state.start/60 + " minutes are up!"}
              icon="icon.png"
              tag="expired-time"
              timeout="2000"
              onClick={event => this.handleNotificationClick(event)}
            
            />
            <div className="length-buttons">
              <button onClick={this.setPomodoro}>Pomodoro</button>
              <button onClick={this.setShortBreak}>Short Break</button>
              <button onClick={this.setLongBreak}>Long Break</button>
            </div>
            {this.processTime(this.state.time)}
            <div className="control-buttons">
              <form ref="taskForm" onSubmit={this.addTask}>
                <button ype="submit" onClick={this.startTimer}>Start</button>
                <input type="text" ref="taskName" placeholder="Task"/>
              </form>
            </div>
            <div className="control-buttons">
              <button onClick={this.pauseTimer}>Pause</button>
              <button onClick={this.resetTimer}>Reset</button>
            </div>
            {/* {this.state.tasks.map(task => {
              return (
                <div key={task}>{task}</div>
              )
              })
            } */}
              {
                Object.keys(this.state.tasks).map(function(key) {
                  return <div className="list-group-item list-group-item-info">{this.state.tasks[key]}</div>
                }.bind(this))
              }

        </div>
    )
  }
}

export default PomoTimer;