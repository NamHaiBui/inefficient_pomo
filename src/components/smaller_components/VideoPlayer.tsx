import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const videoCategories: Record<string, string[]> = {
  'questionable': [
    'https://www.youtube.com/embed/zuTOfSqpAPM',
    'https://www.youtube.com/embed/sYsUONE0lpc',
    'https://www.youtube.com/embed/7Kvi0Glug8Q',
    'https://www.youtube.com/embed/LH5R3YGGm-A',
    'https://www.youtube.com/embed/di9s4e23cYw',
    'https://www.youtube.com/embed/fC7oUOUEEi4',
    'https://www.youtube.com/embed/5DlROhT8NgU',
    'https://www.youtube.com/embed/sVZ1k1z9P1M',
    'https://www.youtube.com/embed/y3p8c4Jw9hA',
    'https://www.youtube.com/embed/RD0yWv9v2cY'
  ],
  'linkedin': [
    'https://www.youtube.com/embed/Jw7EMtFXfng', // Dr. K and Mrs. K Career & Life Advice 
    'https://m.youtube.com/embed/E7273NgdtF4&t=200s', // Bryan Johnson: Don't trust any doctor
    'https://www.youtube.com/embed/OqlPU1CKEpI', // Challenging Bryan Johnson On His “Never Die” Biohacking Protocol
    'https://www.youtube.com/embed/xpvOhgoKrg4', // Bryan Johnson: The Five Science-Backed Habits For Longer Living
    'https://www.youtube.com/BryanJohnson', // Bryan Johnson YouTube Channel
    'https://www.youtube.com/embed/dQw4w9WgXcQ', //  Rick Astley - Never Gonna Give You Up (classic career advice 😉)
    'https://www.youtube.com/embed/f9c5PLeLpxI', // How to Choose the Right Career (Indeed Career Advice)
    'https://www.youtube.com/embed/aVkMwFkpbhU', // 10 HIGH Paying Jobs That Don't Require a College Degree!
    'https://www.youtube.com/embed/vwLtJHQOx7U', //  How to Give a Killer Presentation (TED)
    'https://www.youtube.com/embed/h5yUCoLpH3k'  //  The surprising habits of original thinkers (TED)
  ],
  'adhd': [
    'https://www.youtube.com/embed/1YHvkBP_VFw',
    'https://www.youtube.com/embed/L_fcrOyoWZ8',
    'https://www.youtube.com/embed/JwIM1Sm53tc',
    'https://www.youtube.com/embed/79KudaiHynU',
    'https://www.youtube.com/embed/fXCUaRE-5Rc',
    'https://www.youtube.com/embed/fC7oUOUEEi4',
    'https://www.youtube.com/embed/nFrxAqLDmq0',
    'https://www.youtube.com/embed/sVZ1k1z9P1M',
    'https://www.youtube.com/embed/B3a7H5pqlVg'
  ],
  'short': [
    'https://www.youtube.com/embed/SHORT_VIDEO_ID',
  ],
} as const;

type VideoContent = keyof typeof videoCategories;

interface VideoPlayerProps {
  videoContent: VideoContent;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoContent }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    setCurrentVideo(0);
  }, [videoContent]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const parentElement = container.parentElement;

        if (parentElement) {
          const isShort = videoContent === 'short';
          const aspectRatio = isShort ? 9 / 16 : 16 / 9;
          const parentWidth = parentElement.clientWidth;
          const parentHeight = parentElement.clientHeight;

          let width = parentWidth;
          let height = width / aspectRatio;

          if (height > parentHeight) {
            height = parentHeight;
            width = height * aspectRatio;
          }

          container.style.width = `${width}px`;
          container.style.height = `${height}px`;
          container.style.position = 'absolute';
          container.style.left = `${(parentWidth - width) / 2}px`;
          container.style.top = `${(parentHeight - height) / 2}px`;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [videoContent]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    if ('touches' in e) {
      startX.current = e.touches[0].clientX;
    } else {
      startX.current = e.clientX;
    }
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    let currentX;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    const deltaX = startX.current - currentX;
    const swipeThreshold = 50;

    if (deltaX > swipeThreshold) {
      isDragging.current = false;
      handleSwipeLeft();
    } else if (deltaX < -swipeThreshold) {
      isDragging.current = false;
      handleSwipeRight();
    }
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const handleSwipeLeft = () => {
    setCurrentVideo((currentVideo + 1) % videoCategories[videoContent].length);
  };

  const handleSwipeRight = () => {
    setCurrentVideo(
      (currentVideo - 1 + videoCategories[videoContent].length) % videoCategories[videoContent].length
    );
  };

 // VideoPlayer.tsx
return (
  <div className="flex flex-col w-full h-full">
    {/* Video Container remains the same */}
    <div ref={containerRef} className="relative flex-grow">
      <iframe
        src={videoCategories[videoContent][currentVideo]}
        title="Video Player"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>

    {/* Fixed Swipe Control Section */}
    <div className="relative h-16 bg-gray-100 mt-2 rounded-lg">
      <div 
        className="absolute inset-0 flex items-center justify-between px-4"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <button 
          onClick={handleSwipeRight}  // Changed from handleSwipeRight
          className="w-1/3 h-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        
        <div className="w-1/3 h-full flex items-center justify-center">
          <div className="flex gap-2">
            {videoCategories[videoContent]?.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentVideo ? 'bg-gray-800' : 'bg-gray-400'
                }`}
                role="button"
                onClick={() => setCurrentVideo(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentVideo(index);
                }}
                tabIndex={0}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSwipeLeft}  // Changed from handleSwipeLeft
          className="w-1/3 h-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center cursor-pointer"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  </div>
);
};

export default VideoPlayer;