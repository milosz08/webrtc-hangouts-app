'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import PropTypes from 'prop-types';
import { useAppContext } from '../context/AppContextProvider';
import CameraWindow from './CameraWindow';

const CameraWindowContainer = ({
  camera,
  stream,
  index,
  highlightedIndex,
  visibleCameras,
  onDragStart,
  onDragOver,
  onDrop,
  isSmallVariant,
}) => {
  const { state } = useAppContext();

  const isCurrentUser = camera => {
    return camera.nickname === state.nickname;
  };

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, index + visibleCameras)}
      onDragOver={e => onDragOver(e, index + visibleCameras)}
      onDrop={e => onDrop(e, index + visibleCameras)}
      key={camera.nickname}>
      <CameraWindow
        nickname={camera.nickname}
        stream={stream}
        isHost={camera.isHost}
        isHighlighted={index + visibleCameras === highlightedIndex}
        isVideoOn={isCurrentUser(camera) ? state.isVideoOn : camera.isVideoOn}
        isAudioOn={isCurrentUser(camera) ? state.isAudioOn : camera.isAudioOn}
        isMuted={isCurrentUser(camera)}
        isSmallVariant={isSmallVariant}
      />
    </div>
  );
};

CameraWindowContainer.propTypes = {
  camera: PropTypes.any.isRequired,
  stream: PropTypes.any,
  index: PropTypes.number.isRequired,
  highlightedIndex: PropTypes.number,
  visibleCameras: PropTypes.number.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  isSmallVariant: PropTypes.bool.isRequired,
};

export default CameraWindowContainer;
