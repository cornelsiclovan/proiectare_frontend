import React, { useRef, useState } from "react";

const CustomRender = ({ id, content, data, inputs, outputs }) => {
  /// touch gesture on ipad
  const eleRef = useRef();
  const [{ dx, dy }, setOffset] = useState({ dx: 0, dy: 0 });


  const handleMouseDown = (e) => {

    if (e.type === "touchstart") {
      
      const startPos = {
        x: e.clientX - dx,
        y: e.clientY - dy,
      };

    

      const handleMouseMove = (e) => {
        const ele = eleRef.current;

        

        if (!ele) {
          return;
        }

        // How far the mouse has been moved
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;

        // Set the position of element
        ele.style.transform = `translate(${dx}px, ${dy}px)`;

        // Reassign the position of mouse

        setOffset({ dx, dy });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleTouchStart = (e) => {

    if (e.type === "touchstart") {
     
      const touch = e.touches[0];

      const startPos = {
         x: touch.clientX,
         y: touch.clientY
      };

 

      const handleTouchMove = (e) => {
        const ele = eleRef.current;
        if (!ele) {
          return;
        }

        const zoom = +ele.parentElement.parentElement.parentElement.style.zoom.split("%")[0]/100;
        const scrollX = ele.parentElement.parentElement.parentElement.parentElement.scrollLeft;
        const scrollY = ele.parentElement.parentElement.parentElement.parentElement.scrollTop;

        const touch = e.touches[0];
        
        let touchX = touch.clientX

        if(touchX  - 170 < 0) {
          touchX = 170;
        }

        let dx = (touchX - 170 + scrollX)/zoom;
        let dy = (touch.clientY - 185 + scrollY)/zoom;; 

        //ele.style.transform = `translate(${dx}px, ${dy}px)`;

        // console.log(dx, dy);

        if(dy < 0) {dy = 0}
        // if(dx < 0) {dx = 0}

        data.coordinates = [dx, dy];

        data.triggerChange(true);
        //setOffset({ dx, dy });
      };

      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }
    
  };

  //// end touch on ipad

  return (
    <div
      ref={eleRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ background: id.split("-")[1], touchAction: "none" }}
    >
      <div style={{ textAlign: "right" }}>
        <button style={{ padding: "5px" }} onClick={() => data.onClick(id)}>
          x
        </button>
      </div>
      <div role="button" style={{ padding: "5px" }}></div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* {inputs.map((port) => React.cloneElement(port, {style: { width: '25px', height: '25px', background: '#1B263B' }}))}
         {outputs.map((port) => React.cloneElement(port, {style: { width: '25px', height: '25px', background: '#1B263B' }}))} */}
      </div>
    </div>
  );
};

export default CustomRender;
