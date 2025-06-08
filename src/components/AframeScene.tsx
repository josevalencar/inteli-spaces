// components/AframeScene.tsx
import React from 'react';
import 'aframe';

const AframeScene: React.FC = () => (
  <a-scene>
    <a-sky src="/inteli_lab.jpg"></a-sky>
    <a-box position="0 1 -3" rotation="0 45 0" color="#4CC3D9"></a-box>

    {/* Glassmorphism Panel */}
    <a-entity position="0 1.6 -2">
      {/* Glass Panel */}
      <a-plane 
        width="1.5" 
        height="1.2" 
        color="#ffffff" 
        opacity="0.25" 
        material="side: double; transparent: true;" 
        shader="flat"
        radius="0.2"
      ></a-plane>
      {/* Option Buttons */}
      <a-entity position="0 0.3 0">
        <a-plane 
          width="1.1" height="0.22" position="0 0 0.01" color="#fff" opacity="0.45"
          material="side: double; transparent: true;" shader="flat"
          class="option-btn"
          events="click: () => console.log('Option 1 clicked')"
        >
          <a-text value="Option 1" align="center" color="#222" position="0 0 0.02" width="1"></a-text>
        </a-plane>
      </a-entity>
      <a-entity position="0 0 0">
        <a-plane 
          width="1.1" height="0.22" position="0 0 0.01" color="#fff" opacity="0.45"
          material="side: double; transparent: true;" shader="flat"
          class="option-btn"
          events="click: () => console.log('Option 2 clicked')"
        >
          <a-text value="Option 2" align="center" color="#222" position="0 0 0.02" width="1"></a-text>
        </a-plane>
      </a-entity>
      <a-entity position="0 -0.3 0">
        <a-plane 
          width="1.1" height="0.22" position="0 0 0.01" color="#fff" opacity="0.45"
          material="side: double; transparent: true;" shader="flat"
          class="option-btn"
          events="click: () => console.log('Option 3 clicked')"
        >
          <a-text value="Option 3" align="center" color="#222" position="0 0 0.02" width="1"></a-text>
        </a-plane>
      </a-entity>
    </a-entity>
  </a-scene>
);

export default AframeScene;
