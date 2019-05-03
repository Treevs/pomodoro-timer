import React from 'react';

class PomoTimer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      time: 25*60,
      isRunning: false,
      start: 0
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
  }
  startTimer() {
    this.setState({
      isRunning: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })
    this.timer = setInterval(() => this.setState({
      time: Date.now() - this.state.start
    }), 1);
  }
  stopTimer() {
    this.setState({isRunning: false})
    clearInterval(this.timer)
  }
  resetTimer() {
    this.setState({time: 0, isRunning: false})
  }
  
  render() {
    return (
        <div>
            <div className="length-buttons">
              <button>Pomodor</button>
              <button>Short Break</button>
              <button>Long Break</button>
            </div>
            {this.state.time}
            <div className="control-buttons">
              <button>Start</button>
              <button>Pause</button>
              <button>Reset</button>
            </div>
        </div>
    )
  }
}

export default PomoTimer;