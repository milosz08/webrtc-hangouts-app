'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect, useState } from 'react';

const useDraggableCameras = () => {
  const [visibleCameras, setVisibleCameras] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const [cameras, setCameras] = useState([]);
  const [isChatOpen, setChatOpen] = useState(false);

  const updateVisibleCameras = () => {
    let visibleCameras;
    if (window.innerWidth < 768) {
      visibleCameras = 1;
    } else if (window.innerWidth >= 768 && window.innerWidth < 906) {
      visibleCameras = isChatOpen ? 2 : 4;
    } else if (window.innerWidth >= 906 && window.innerWidth < 1240) {
      visibleCameras = 4;
    } else if (window.innerWidth >= 1240 && window.innerWidth < 1536) {
      visibleCameras = isChatOpen ? 4 : 6;
    } else {
      visibleCameras = 6;
    }
    setVisibleCameras(visibleCameras);
  };

  const toggleChat = () => {
    setChatOpen(prevState => !prevState);
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('cameraIndex', index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    setHighlightedIndex(index);
  };

  const onDrop = (e, index) => {
    e.stopPropagation();
    setCameras(prevCameras => {
      const draggedCameraIndex = e.dataTransfer.getData('cameraIndex');
      const temp = prevCameras[draggedCameraIndex];
      prevCameras[draggedCameraIndex] = prevCameras[index];
      prevCameras[index] = temp;
      return prevCameras;
    });
    setHighlightedIndex(null);
  };

  useEffect(() => {
    window.addEventListener('resize', updateVisibleCameras);
    updateVisibleCameras();
    return () => {
      window.removeEventListener('resize', updateVisibleCameras);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen]);

  return {
    cameras,
    visibleCameras,
    highlightedIndex,
    isChatOpen,
    toggleChat,
    onDragStart,
    onDragOver,
    onDrop,
    setCameras,
  };
};

export default useDraggableCameras;
