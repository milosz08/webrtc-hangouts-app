'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useEffect, useState } from 'react';
import CameraWindow from '../components/CameraWindow';

const MeetingPage = () => {
  const [cameras, setCameras] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [visibleCameras, setVisibleCameras] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const updateVisibleCameras = () => {
    if (window.innerWidth < 768) {
      setVisibleCameras(1);
    } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      setVisibleCameras(4);
    } else {
      setVisibleCameras(6);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateVisibleCameras);
    updateVisibleCameras();

    return () => {
      window.removeEventListener('resize', updateVisibleCameras);
    };
  }, []);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('cameraIndex', index);
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    setHighlightedIndex(index);
  };

  const onDrop = (e, index) => {
    const draggedCameraIndex = e.dataTransfer.getData('cameraIndex');
    const newCameras = [...cameras];
    const temp = newCameras[draggedCameraIndex];
    newCameras[draggedCameraIndex] = newCameras[index];
    newCameras[index] = temp;
    setCameras(newCameras);
    setHighlightedIndex(null);
  };

  return (
    <div className="bg-[#dedfdf] dark:bg-[#1f194a] h-full pb-4 flex flex-col flex-grow">
      <div className="flex justify-around overflow-x-auto p-2 scrollbar scrollbar-thumb-purple-400 scrollbar-track-blue-200 dark:scrollbar-thumb-purple-800 dark:scrollbar-track-blue-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full shadow-inner">
        <div className="inline-flex">
          {cameras.slice(visibleCameras).map((camera, index) => (
            <div className="w-40 flex-shrink-0 px-1" key={camera}>
              <div
                draggable
                onDragStart={e => onDragStart(e, index + visibleCameras)}
                onDragOver={e => onDragOver(e, index + visibleCameras)}
                onDrop={e => onDrop(e, index + visibleCameras)}
                key={camera}>
                <CameraWindow
                  camera={camera}
                  isHighlighted={index + visibleCameras === highlightedIndex}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`pt-10 px-2 md:pt-2 sm:px-12 grid xl:px-16 ${visibleCameras === 4 ? 'grid-cols-2 gap-2' : visibleCameras === 6 ? 'grid-cols-3 gap-2' : ''}`}>
        {cameras.slice(0, visibleCameras).map((camera, index) => (
          <div
            draggable
            onDragStart={e => onDragStart(e, index)}
            onDragOver={e => onDragOver(e, index)}
            onDrop={e => onDrop(e, index)}
            key={camera}>
            <CameraWindow
              camera={camera}
              isHighlighted={index === highlightedIndex}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingPage;
