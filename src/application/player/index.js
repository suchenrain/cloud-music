import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import MiniPlayer from './mini';
import NormalPlayer from './normal';
import { findIndex, getSongUrl, isEmptyObject, shuffle } from '@api/utils';
import { playMode } from '@api/config';

function Player(props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  //记录之前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const audioRef = useRef();
  const songReady = useRef(true);

  const {
    fullScreen,
    playing,
    playList: immutablePlayList,
    currentIndex,
    currentSong: immutableCurrentSong,
    mode,
    sequencePlayList: immutableSequencePlayList,
  } = props;
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changeModeDispatch,
    changePlayListDispatch,
  } = props;

  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  // useEffect(() => {
  //   if (isEmptyObject(currentSong)) return;
  //   changeCurrentIndexDispatch(0);
  //   const current = playList[0];
  //   changeCurrentDispatch(current);
  //   // @ts-ignore
  //   audioRef.current.src = getSongUrl(current.id);
  //   // setTimeout(() => {
  //   //   // @ts-ignore
  //   //   audioRef.current.play();
  //   // }, 0);
  //   // togglePlayingDispatch(true);
  //   setCurrentTime(0);
  //   setDuration((current.dt / 1000) | 0);
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      // @ts-ignore
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    )
      return;

    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    songReady.current = false;
    setPreSong(current);
    // @ts-ignore
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      // @ts-ignore
      audioRef.current.play().then(() => {
        songReady.current = true;
      });
    });
    togglePlayingDispatch(true);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);
    // eslint-disable-next-line
  }, [playList, currentIndex]);

  useEffect(() => {
    // @ts-ignore
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  };

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    // @ts-ignore
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
  };

  const handleLoop = () => {
    // @ts-ignore
    audioRef.current.currentTime = 0;
    // changePlayingState(true);
    togglePlayingDispatch(true);
    // @ts-ignore
    audioRef.current.play();
  };

  const handlePrev = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };
  const handlePlayError = () => {
    songReady.current = true;
    alert('播放出错');
  };

  const changeMode = () => {
    const newMode = (mode + 1) % 3;
    if (newMode === playMode.sequence) {
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === playMode.loop) {
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === playMode.random) {
      const newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          percent={percent}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
        ></MiniPlayer>
      )}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          mode={mode}
          fullScreen={fullScreen}
          percent={percent}
          playing={playing}
          duration={duration}
          currentTime={currentTime}
          toggleFullScreen={toggleFullScreenDispatch}
          handlePrev={handlePrev}
          handleNext={handleNext}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          changeMode={changeMode}
        ></NormalPlayer>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handlePlayError}
      ></audio>
    </div>
  );
}

const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
});

const mapDispatchToProps = (dispatch) => ({
  togglePlayingDispatch(data) {
    dispatch(actionCreators.changePlayingState(data));
  },
  toggleFullScreenDispatch(data) {
    dispatch(actionCreators.changeFullScreen(data));
  },
  togglePlayListDispatch(data) {
    dispatch(actionCreators.changeShowPlayList(data));
  },
  changeCurrentIndexDispatch(index) {
    dispatch(actionCreators.changeCurrentIndex(index));
  },
  changeCurrentDispatch(data) {
    dispatch(actionCreators.changeCurrentSong(data));
  },
  changeModeDispatch(data) {
    dispatch(actionCreators.changePlayMode(data));
  },
  changePlayListDispatch(data) {
    dispatch(actionCreators.changePlayList(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
