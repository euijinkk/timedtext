import axios from 'axios';
import React, { useCallback, useMemo, useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import X2JS from 'x2js';
import { Media, Player, controls } from 'react-media-player';
import {
  PlayPause,
  CurrentTime,
  Progress,
  SeekBar,
  Duration,
  MuteUnmute,
  Volume,
  Fullscreen,
} from 'react-media-player/lib/controls';
import styled from 'styled-components';
import { albumCover, playBtn } from './assets';
import { line } from 'strip-comments';
// import { CurrentTime } from 'react-media-player/lib/controls';

const App = () => {
  const [tt, setTt] = useState();
  const [currentTime, setCurrentTime] = useState();
  const playerRef = useRef();
  const [currentMusic, setCurrentMusic] = useState("o_SYttJm0SE");

  const getTimedText = useCallback(async (videoId) => {
    const timedText = await axios.get(
      `https://video.google.com/timedtext?lang=ko&v=${videoId}`,
    );
    var x2js = new X2JS();
    const a = x2js
      .xml2js(timedText.data)
      .transcript.text.map((line) => ({
        ...line,
        __text: line.__text.replace('&#39;', "'"),
      }));
    setTt(a);
  }, []);

  useEffect(() => {
    getTimedText(currentMusic);
  }, []);

  const handleTimeUpdate = (event) => {
    tt.forEach((line) => {
      if (
        parseFloat(line._start) <= event.currentTime &&
        event.currentTime < parseFloat(line._start) + parseFloat(line._dur)
      ) {
        setCurrentTime(line._start);
      }
    });
  };

  const handleLyrics = (line) => {
    playerRef.current.context.media.seekTo(parseFloat(line._start));
  };

  // const handlePlay = () => {
  //   playerRef.current.context.media.play();
  // }
  return (
    <YoutubeWrapper>
      <Media>
        <div className="media">
          <div className="media-player" display="none">
            {currentMusic && <Player
              src={`https://www.youtube.com/embed/${currentMusic}`}
              vendor="youtube"
              onTimeUpdate={handleTimeUpdate}
              ref={playerRef}
              style={{ display: 'none' }}
            />}
          </div>
          <div className="media-controls">
            <img
              src={albumCover}
              alt="album-cover"
              className="left"
              width="100px"
              height="100px"
            />

            <div className="right">
              <div className="album">방탄소년단 - Love Yourself</div>
              <div className="top">
                <CurrentTime2 />
                {/* <Progress /> */}
                <SeekBar2 />
                <Duration />
              </div>
              <div className="bottom">
                <PlayPause />
                {/* <img src={playBtn} alt="play" onClick={handlePlay} /> */}
                {/* <MuteUnmute /> */}
                <Volume2 />
                {/* <Fullscreen /> */}
              </div>
            </div>
          </div>
        </div>
        {/* <iframe
      className="video"
      type="text/html"
      title="youtuve video player"
      width="100%"
      height="500px"
      src="https://www.youtube.com/embed/o_SYttJm0SE"
      frameBorder="0"
      allowFullScreen
      onTimeUpdate={handleTimeUpdate}
    ></iframe> */}
      </Media>
      {tt &&
        tt.map((line, index) => (
          <div
            key={index}
            onClick={() => handleLyrics(line)}
            className={'lyrics ' + (currentTime === line._start && 'highlight')}
          >
            {line.__text}
          </div>
        ))}
    </YoutubeWrapper>
  );
};

export default App;

const CurrentTime2 = styled(CurrentTime)`
  /* font-size:px; */
`;

const SeekBar2 = styled(SeekBar)`
  /* font-size:px; */
  width: 300px;
  margin: 0 20px;
`;

const Volume2 = styled(Volume)`
  /* font-size:px; */
`;

const YoutubeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .media {
    margin-bottom: 50px;
    width: 100%;
    height: 180px;
    background: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(36,189,208,1) 22%, rgba(37,188,212,1) 29%, rgba(40,183,227,1) 55%, rgba(45,175,253,1) 65%, rgba(43,179,240,1) 78%, rgba(44,177,246,1) 88%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .left {
      margin-right: 30px;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    &-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      .top {
        margin: 20px 0;
      }
    }
  }
  .lyrics {
    line-height: 30px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }

  .highlight {
    color: red;
  }
`;
