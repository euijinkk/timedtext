import axios from 'axios';
import React, { useCallback, useMemo, useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import X2JS from 'x2js';
import { Media, Player, controls, utils } from 'react-media-player';
import styled from 'styled-components'
import { useGetRecoilValueInfo_UNSTABLE } from 'recoil';

const App = () => {
  const [tt, setTt] = useState();
  const [currentTime, setCurrentTime] = useState();
  const { PlayPause, MuteUnmute } = controls;
  const playerRef = useRef();

  const getTimedText = useCallback(async () => {
    const timedText = await axios.get(
      'https://video.google.com/timedtext?lang=ko&v=o_SYttJm0SE',
    );
    var x2js = new X2JS();
    setTt(x2js.xml2js(timedText.data).transcript.text);
  }, []);

  useEffect(() => {
    getTimedText();
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
  }
  return (
    <YoutubeWrapper>
      <Media>
        <div className="media">
          <div className="media-player">
            <Player
              src="https://www.youtube.com/embed/o_SYttJm0SE"
              vendor="youtube"
              onTimeUpdate={handleTimeUpdate}
              ref={playerRef}
            />
          </div>
          <div className="media-controls">
            <PlayPause />
            <MuteUnmute />
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
            className={"lyrics " + (currentTime === line._start && 'highlight')}
          >
            {line.__text}
          </div>
        ))}
    </YoutubeWrapper>
  );
};

export default App;

const YoutubeWrapper = styled.div`
display:flex;
flex-direction:column;
  .lyrics{
    line-height: 30px;
    font-size:16px;
    text-align:center;
  }

  .highlight{
    color:red;
  }
`