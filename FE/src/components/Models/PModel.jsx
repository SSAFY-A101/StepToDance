import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import { LoopOnce } from 'three';
import model from '../../../public/Characters/perfectnight.glb';

export function PerfectNightModel(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(model);
  const { actions } = useAnimations(animations, group);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    if (actions) {
      const actionNames = Object.keys(actions);
      console.log('Actions:', actions);
      console.log('Action Names:', actionNames);
      if (actionNames.length > 0) {
        const firstAnimationName = actionNames[0];
        const action = actions[firstAnimationName];
        if (action) {
          action.reset(); // Ensure the action is reset to start
          action.setLoop(LoopOnce);
          action.clampWhenFinished = true;
          action.play();
          console.log("Playing animation:", firstAnimationName);

          const checkAnimationCompletion = () => {
            if (action.time >= action.getClip().duration) {
              setAnimationCompleted(true);
              clearInterval(intervalId);
              console.log("Animation completed:", firstAnimationName);
            }
          };

          const intervalId = setInterval(checkAnimationCompletion, 100);
          return () => clearInterval(intervalId);
        } else {
          console.log("Action is undefined for:", firstAnimationName);
        }
      } else {
        console.log("No action names found");
      }
    } else {
      console.log("No actions or animations found");
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Rokoko_Video_Character" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <group name="Root">
            <group name="Newton_HeadFace">
              <skinnedMesh
                name="Newton_HeadFace_Mesh"
                geometry={nodes.Newton_HeadFace_Mesh.geometry}
                material={materials['Material #22']}
                skeleton={nodes.Newton_HeadFace_Mesh.skeleton}
                morphTargetDictionary={nodes.Newton_HeadFace_Mesh.morphTargetDictionary}
                morphTargetInfluences={nodes.Newton_HeadFace_Mesh.morphTargetInfluences}
              />
              <skinnedMesh
                name="Newton_HeadFace_Mesh_1"
                geometry={nodes.Newton_HeadFace_Mesh_1.geometry}
                material={materials['Head1.001']}
                skeleton={nodes.Newton_HeadFace_Mesh_1.skeleton}
                morphTargetDictionary={nodes.Newton_HeadFace_Mesh_1.morphTargetDictionary}
                morphTargetInfluences={nodes.Newton_HeadFace_Mesh_1.morphTargetInfluences}
              />
              <skinnedMesh
                name="Newton_HeadFace_Mesh_2"
                geometry={nodes.Newton_HeadFace_Mesh_2.geometry}
                material={materials['Material #21']}
                skeleton={nodes.Newton_HeadFace_Mesh_2.skeleton}
                morphTargetDictionary={nodes.Newton_HeadFace_Mesh_2.morphTargetDictionary}
                morphTargetInfluences={nodes.Newton_HeadFace_Mesh_2.morphTargetInfluences}
              />
              <skinnedMesh
                name="Newton_HeadFace_Mesh_3"
                geometry={nodes.Newton_HeadFace_Mesh_3.geometry}
                material={materials.Pupil}
                skeleton={nodes.Newton_HeadFace_Mesh_3.skeleton}
                morphTargetDictionary={nodes.Newton_HeadFace_Mesh_3.morphTargetDictionary}
                morphTargetInfluences={nodes.Newton_HeadFace_Mesh_3.morphTargetInfluences}
              />
              <skinnedMesh
                name="Newton_HeadFace_Mesh_4"
                geometry={nodes.Newton_HeadFace_Mesh_4.geometry}
                material={materials.Lens}
                skeleton={nodes.Newton_HeadFace_Mesh_4.skeleton}
                morphTargetDictionary={nodes.Newton_HeadFace_Mesh_4.morphTargetDictionary}
                morphTargetInfluences={nodes.Newton_HeadFace_Mesh_4.morphTargetInfluences}
              />
              <skinnedMesh
                name="Newton_HeadFace_Mesh_5"
                geometry={nodes.Newton_HeadFace_Mesh_5.geometry}
                material={materials.sclera}
                skeleton={nodes.Newton_HeadFace_Mesh_5.skeleton}
                morphTargetDictionary={nodes.Newton_HeadFace_Mesh_5.morphTargetDictionary}
                morphTargetInfluences={nodes.Newton_HeadFace_Mesh_5.morphTargetInfluences}
              />
              <skinnedMesh
                name="Newton_HeadFace_Mesh_6"
                geometry={nodes.Newton_HeadFace_Mesh_6.geometry}
                material={materials.Iris}
                skeleton={nodes.Newton_HeadFace_Mesh_6.skeleton}
                morphTargetDictionary={nodes.Newton_HeadFace_Mesh_6.morphTargetDictionary}
                morphTargetInfluences={nodes.Newton_HeadFace_Mesh_6.morphTargetInfluences}
              />
            </group>
            <group name="Newton_Headless">
              <skinnedMesh
                name="Newton_Headless_Mesh"
                geometry={nodes.Newton_Headless_Mesh.geometry}
                material={materials.Head1}
                skeleton={nodes.Newton_Headless_Mesh.skeleton}
              />
              <skinnedMesh
                name="Newton_Headless_Mesh_1"
                geometry={nodes.Newton_Headless_Mesh_1.geometry}
                material={materials.RKK_Joint}
                skeleton={nodes.Newton_Headless_Mesh_1.skeleton}
              />
            </group>
            <primitive object={nodes.Hips} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(model);

function PModel() {
  return (
    <Canvas
      style={{ width: '100%', height: '70vh' }}
      camera={{ position: [4, 4, 4], fov: 40 }}
    >
      <directionalLight position={[1, 1, 1]} castShadow intensity={2} />
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <PerfectNightModel />
      <OrbitControls
        makeDefault
        minAzimuthAngle={3}
        maxAzimuthAngle={4.5}
        minPolarAngle={1}
        maxPolarAngle={2}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        zoomSpeed={1}
      />
    </Canvas>
  );
}

export default PModel;
