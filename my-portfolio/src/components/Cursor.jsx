import { useEffect, useRef, useState } from 'react';

function Cursor() {
  const innerRef = useRef(null);
  const outerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const outerPositionRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const hoverRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      return undefined;
    }

    const updateInner = (x, y) => {
      if (!innerRef.current) {
        return;
      }

      innerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const updateOuter = (x, y) => {
      if (!outerRef.current) {
        return;
      }

      outerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const handleMouseMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;

      targetPositionRef.current.x = x;
      targetPositionRef.current.y = y;

      updateInner(x, y);

      if (!hasMovedRef.current) {
        outerPositionRef.current.x = x;
        outerPositionRef.current.y = y;
        updateOuter(x, y);
        hasMovedRef.current = true;
      }

      const hoveringInteractive = Boolean(event.target?.closest('a, button'));
      if (hoverRef.current !== hoveringInteractive) {
        hoverRef.current = hoveringInteractive;
        setIsHovering(hoveringInteractive);
      }
    };

    const animateOuter = () => {
      const smoothing = 0.18;

      outerPositionRef.current.x += (targetPositionRef.current.x - outerPositionRef.current.x) * smoothing;
      outerPositionRef.current.y += (targetPositionRef.current.y - outerPositionRef.current.y) * smoothing;

      updateOuter(outerPositionRef.current.x, outerPositionRef.current.y);
      animationFrameRef.current = requestAnimationFrame(animateOuter);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameRef.current = requestAnimationFrame(animateOuter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={innerRef} data-hovering={isHovering} />
      <div className="cursor-outline" ref={outerRef} data-hovering={isHovering} />
    </>
  );
}

export default Cursor;