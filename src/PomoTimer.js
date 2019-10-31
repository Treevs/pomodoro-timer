import React from 'react';
import ReactNotifications from 'react-browser-notifications';
const store = require('store');


class PomoTimer extends React.Component {
  
  constructor(props){
    
    super(props);
    var pomoTime = store.get('pomoTime');
    if(!pomoTime) {
      pomoTime = 25*60;
    }
    var shortTime = store.get('shortTime');
    if(!shortTime) {
      shortTime = 5*60;
    }
    var longTime = store.get('longTime');
    if(!longTime) {
      longTime = 15*60;
    }
    this.state = {
      time: pomoTime,
      start: pomoTime,
      isRunning: false,
      tasks: {},
      pomoTime: pomoTime,
      shortTime: shortTime,
      longTime: longTime,
      activeTimer: 1,
      editTimer: false
    }
    // Active timer
    // 1) Pomo
    // 2) Short
    // 3) Long
    this.startTimer = this.startTimer.bind(this)
    this.pauseTimer = this.pauseTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.setPomodoro = this.setPomodoro.bind(this)
    this.setShortBreak = this.setShortBreak.bind(this)
    this.setLongBreak = this.setLongBreak.bind(this)
    this.showNotifications = this.showNotifications.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.addTask = this.addTask.bind(this);
    this.toggleTimeEdit = this.toggleTimeEdit.bind(this);
    this.editTimer = this.editTimer.bind(this);
  }
 
  showNotifications() {
    if(this.n.supported()) this.n.show();
  }
 
  handleNotificationClick(event) {
    window.focus();
    this.n.close(event.target.tag);
  }
  startTimer() {
    if(!this.state.isRunning || this.state.time == 0) {
      if(this.state.time == 0) {
        console.log("WOW");
        this.setState({
          time: this.state.start
        })
      } else {
        console.log(this.state.time)
      }
      this.setState({
        isRunning: true,
      })
      this.timer = setInterval(() => this.setState({
        time: this.state.time - 1
      }), 1000);
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
    this.setState({time: this.state.pomoTime, start: this.state.pomoTime, isRunning: false, activeTimer: 1})
    clearInterval(this.timer)
  }
  setShortBreak() {
    this.setState({time: this.state.shortTime, start: this.state.shortTime, isRunning: false, activeTimer: 2})
    clearInterval(this.timer)
  }
  setLongBreak() {
    this.setState({time: this.state.longTime, start: this.state.longTime, isRunning: false, activeTimer: 3})
    clearInterval(this.timer)
  }

  toggleTimeEdit() {
    this.setState({editTimer: !this.state.editTimer})
  }

  editTimer(e) {
    e.preventDefault();
    var newTime = this.refs.newTime.value;
    newTime = newTime*60; //Convert to minutes
    var activeTimer = this.state.activeTimer; 
    console.log(this.state.activeTimer);
    switch(activeTimer){
      case 1:
        this.setState({pomoTime: newTime}, () => {
          this.setPomodoro();
          store.set('pomoTime', newTime);
        });
        break;
      case 2:
        this.setState({shortTime: newTime}, () => {
          this.setShortBreak();
          store.set('shortTime', newTime);
        });
        break;
      case 3:
        this.setState({longTime: newTime}, () => {
          this.setLongBreak();
          store.set('longTime', newTime);
        });
        break;
      default:
        // this.setState({pomoTime: newTime*60});
        //TODO: Throw error
    }
  }

  addTask(e) {
    e.preventDefault();
    var newTask = this.refs.taskName.value;
    if(newTask != null && newTask !== "") {

      var now = new Date();
      var timestamp = this.padTime(now.getHours())+":"+this.padTime(now.getMinutes())+":"+this.padTime(now.getSeconds());
      var tasks = this.state.tasks
      tasks[timestamp] = newTask;
      this.refs.taskForm.reset();
      // this.state.tasks.push(newTask);
      this.setState({tasks: tasks})
    }
  }

  removeTask() {

  }

  padTime(time) {
    if(time < 10) {
      return "0" + time;
    } else {
      return time;
    }
  }

  processTime(time) {
    if (time > 0) {

      var minutes = Math.floor(time / 60);
      var seconds = Math.floor(time % 60);
      if(seconds < 10) {
        seconds = "0" + seconds;
      }
      
      document.title = minutes+":"+seconds + " left";
      return minutes+":"+seconds;
    } else {
      clearInterval(this.timer);
      this.showNotifications();
      //Do a notification
      document.title = "Time's Up!";
      return "0:00";
    }
  }
  
  render() {
    return (
        <div className="card col-sm-6">
            <ReactNotifications
              onRef={ref => (this.n = ref)} // Required
              title="Pomodoro" // Required
              body={"Your " + this.state.start/60 + " minutes are up!"}
              icon="icon.png"
              tag="expired-time"
              timeout="20000"
              onClick={event => this.handleNotificationClick(event)}
            
            />
            <div className="card-header">
              Pomodoro Timer
            </div>
            <div className="card-body">
              <div className="length-buttons" role="group">
                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">

                  <button className={"btn btn-sm "+ (this.state.activeTimer===1 ? 'btn-primary': '')} onClick={this.setPomodoro}>Pomodoro</button>
                  <button className={"btn btn-sm "+ (this.state.activeTimer===2 ? 'btn-primary': '')} onClick={this.setShortBreak}>Short Break</button>
                  <button className={"btn btn-sm "+ (this.state.activeTimer===3 ? 'btn-primary': '')} onClick={this.setLongBreak}>Long Break</button>
                </div>
              </div>
              <div>
                <h1>{this.processTime(this.state.time)}</h1>
              </div>
              { this.state.editTimer &&
                <div className="offset-sm-4 col-sm-4 input-group input-group-sm">
                  <input className="form-control form-control-sm" type="text" ref="newTime" placeholder="New Time"/>
                  <div className="input-group-append">
                    <button className="btn btn-sm btn-primary" onClick={this.editTimer}>Save</button>
                  </div>
                </div>
              }
              <div className="control-buttons breathing-room">
                <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                  <button className={"btn btn-sm " + (this.state.isRunning ? '': 'btn-success')} onClick={this.startTimer}>Start</button>
                  <button className={"btn btn-sm " + (this.state.isRunning ? 'btn-dark': '')} onClick={this.pauseTimer}>Pause</button>
                  <button className="btn btn-sm btn-danger" onClick={this.resetTimer}>Reset</button>
                  <button className="btn btn-sm btn-primary" onClick={this.toggleTimeEdit}>Edit Time</button>
                </div>
              </div>
              <div className="control-buttons justify-content-md-center">
                <div className="" aria-label="Basic example">
                  <form className="offset-sm-2 col-sm-8 input-group input-group-sm" ref="taskForm" onSubmit={this.addTask}>
                    <input className="form-control form-control-sm" type="text" ref="taskName" placeholder="Task"/>
                    <div className="input-group-append">
                      <button className="btn btn-sm btn-primary" type="submit">Add Task</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
              {
                Object.keys(this.state.tasks).map(function(key) {
                  return <div key={key} className="list-group-item list-group-item-info">
                    {key} - {this.state.tasks[key]}
                  </div>
                }.bind(this))
              }

        </div>
    )
  }
}

export default PomoTimer;