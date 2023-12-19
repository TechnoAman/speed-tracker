import React, { Component } from "react";
import screenfull from "screenfull";
import ReactPlayer from "react-player";
import Gauge from "./gauge.js";
import "./App.css"; // Import your CSS file for styling

class App extends Component {
  state = {
    file: null,
    url: null,
    pip: false,
    playing: true,
    controls: true,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    startTime: null,
    endTime: null,
    calculatedSpeed: null,
  };

  setStartTime = () => {
    this.setState({ startTime: this.state.played * this.state.duration });
  };

  setEndTime = () => {
    this.setState({ endTime: this.state.played * this.state.duration });
  };

  resetTimes = () => {
    this.setState({ startTime: null, endTime: null, calculatedSpeed: null });
  };

  calculateSpeed = () => {
    const distance = 0.0201168;
    const time =
      (this.state.endTime - this.state.startTime) * 0.000277777777778;

    const speedInKmPerHour = distance / time;
    var calculatedSpeed = speedInKmPerHour.toFixed(2);

    // Set the calculated speed in the state
    this.setState({ calculatedSpeed });

    return calculatedSpeed;
  };

  load = (url) => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false,
    });
  };

  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({ file });
  };

  loadLocalFile = () => {
    const { file } = this.state;

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileBlob = new Blob([e.target.result], { type: file.type });
        const fileUrl = URL.createObjectURL(fileBlob);

        this.setState({
          url: fileUrl,
          file: null,
        });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleStop = () => {
    this.setState({ url: null, playing: false });
  };

  handleToggleControls = () => {
    const url = this.state.url;
    this.setState(
      {
        controls: !this.state.controls,
        url: null,
      },
      () => this.load(url)
    );
  };

  handleToggleLight = () => {
    this.setState({ light: !this.state.light });
  };

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };

  handleVolumeChange = (e) => {
    this.setState({ volume: parseFloat(e.target.value) });
  };

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  handleSetPlaybackRate = (e) => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };

  handleOnPlaybackRateChange = (speed) => {
    this.setState({ playbackRate: parseFloat(speed) });
  };

  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip });
  };

  handlePlay = () => {
    console.log("onPlay");
    this.setState({ playing: true });
  };

  handleEnablePIP = () => {
    console.log("onEnablePIP");
    this.setState({ pip: true });
  };

  handleDisablePIP = () => {
    console.log("onDisablePIP");
    this.setState({ pip: false });
  };

  handlePause = () => {
    console.log("onPause");
    this.setState({ playing: false });
  };

  handleSeekMouseDown = (e) => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (e) => {
    this.setState({ played: parseFloat(e.target.value) });
  };

  handleSeekMouseUp = (e) => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };

  handleProgress = (state) => {
    console.log("onProgress", state);
    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  handleEnded = () => {
    console.log("onEnded");
    this.setState({ playing: this.state.loop });
  };

  handleDuration = (duration) => {
    console.log("onDuration", duration);
    this.setState({ duration });
  };

  handleClickFullscreen = () => {
    screenfull.request(document.querySelector(".react-player"));
  };

  renderLoadButton = (url, label) => {
    return <button onClick={() => this.load(url)}>{label}</button>;
  };

  skipForward = () => {
    const { played, duration } = this.state;
    const newTime = played * duration + 0.025;
    if (newTime < duration) {
      this.player.seekTo(newTime, "seconds");
    }
  };

  skipBackward = () => {
    const { played, duration } = this.state;
    const newTime = played * duration - 0.025;
    if (newTime > 0) {
      this.player.seekTo(newTime, "seconds");
    }
  };

  ref = (player) => {
    this.player = player;
  };

  render() {
    const {
      url,
      playing,
      controls,
      light,
      volume,
      muted,
      loop,
      played,
      loaded,
      duration,
      playbackRate,
      calculatedSpeed,
      pip,
    } = this.state;
    const SEPARATOR = " · ";

    return (
      <div className="app">
        <section className="video-section">
          <h3> Speed Tracker </h3>
          <div className="player-wrapper">
            <ReactPlayer
              ref={this.ref}
              className="react-player"
              width="100%"
              height="100%"
              url={url}
              pip={pip}
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log("onReady")}
              onStart={() => console.log("onStart")}
              onPlay={this.handlePlay}
              onEnablePIP={this.handleEnablePIP}
              onDisablePIP={this.handleDisablePIP}
              onPause={this.handlePause}
              onBuffer={() => console.log("onBuffer")}
              onPlaybackRateChange={this.handleOnPlaybackRateChange}
              onSeek={(e) => console.log("onSeek", e)}
              onEnded={this.handleEnded}
              onError={(e) => console.log("onError", e)}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
              onPlaybackQualityChange={(e) =>
                console.log("onPlaybackQualityChange", e)
              }
            />
          </div>

          <div className="controls">
            <button className="backward" onClick={this.skipBackward}>Backward 25ms</button>
            <button className="forward" onClick={this.skipForward}>Forward 25ms</button>
          </div>

          <div className="file-input">
            <label htmlFor="fileInput">Choose File:</label>
            <input
              type="file"
              id="fileInput"
              onChange={this.handleFileChange}
            />
            <button onClick={this.loadLocalFile}>Load Local File</button>
          </div>

          <div className="custom-url">
            <label htmlFor="urlInput">Custom URL:</label>
            <input
              id="urlInput"
              ref={(input) => {
                this.urlInput = input;
              }}
              type="text"
              placeholder="Enter URL"
            />
            <button onClick={() => this.setState({ url: this.urlInput.value })}>
              Load
            </button>
          </div>
        </section>
        <div className="calculation-section">
        <Gauge speed={calculatedSpeed||0} />
          <div className="speed-calculator">
            {calculatedSpeed == null && (
              <div>
                <label htmlFor="startTime">Start Time:</label>
                <button onClick={this.setStartTime}>Set Start Time</button>
                <label htmlFor="endTime">End Time:</label>
                <button onClick={this.setEndTime}>Set End Time</button>
              </div>
            )}

            {/* Display the calculated speed in the UI */}
            {calculatedSpeed !== null && (
              <p className="ball-speed">
                Bowling Speed: {calculatedSpeed} km/h
              </p>
            )}

            <p>
              Start Time:{" "}
              {this.state.startTime
                ? this.state.startTime.toFixed(3)
                : "Not set"}{" "}
              seconds
            </p>
            <p>
              End Time:{" "}
              {this.state.endTime ? this.state.endTime.toFixed(3) : "Not set"}{" "}
              seconds
            </p>
          </div>

          {calculatedSpeed && (
            <button onClick={this.resetTimes}>Measure Another ball</button>
          )}

          {calculatedSpeed == null && (
            <button
              onClick={() =>
                this.setState({ calculatedSpeed: this.calculateSpeed() })
              }
            >
              Calculate Bowling Speed
            </button>
          )}
         
        </div>
      </div>
    );
  }
}

export default App;
