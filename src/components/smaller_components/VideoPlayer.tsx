import React, { useState, useRef, useEffect } from 'react';

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
  ]
} as const;

type VideoContent = keyof typeof videoCategories;

interface VideoPlayerProps {
  videoContent: VideoContent;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoContent }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const parentElement = container.parentElement;
        
        if (parentElement) {
          const aspectRatio = 16 / 9;
          const parentWidth = parentElement.clientWidth;
          const parentHeight = parentElement.clientHeight;

          // Calculate dimensions while maintaining aspect ratio
          let width = parentWidth;
          let height = width / aspectRatio;

          // If height exceeds parent container, scale down proportionally
          if (height > parentHeight) {
            height = parentHeight;
            width = height * aspectRatio;
          }

          // Center the video in the container
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
  }, []);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50; // Adjust the threshold as needed

    if (deltaX > swipeThreshold) {
      handleSwipeLeft();
    } else if (deltaX < -swipeThreshold) {
      handleSwipeRight();
    }
  };

  const handleSwipeLeft = () => {
    setCurrentVideo((currentVideo + 1) % videoCategories[videoContent].length);
  };

  const handleSwipeRight = () => {
    setCurrentVideo(
      (currentVideo - 1 + videoCategories[videoContent].length) % videoCategories[videoContent].length
    );
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      <iframe
        src={videoCategories[videoContent][currentVideo]}
        title="Video Player"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: 'none',
          maxWidth: '100%',
          maxHeight: '100%',
          margin: 'auto'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;