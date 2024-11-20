import { OrbitControls } from "@react-three/drei";
import Grid from "./Grid";
import { Board } from "./Board";
import { BoardOverlay } from "./BoardOverlay";
import { GameCard, CARD_DIMENSIONS } from "./GameCard";
import EnvironmentSphere from "./Environment";
import { CameraStatsBridgeInCanvas } from "@/components/ui/CameraStats";

interface GameContentProps {
    onExit: () => void;
    isTestMode: boolean;
    onCameraUpdate: (position: any, rotation: any) => void;
}
  

export default function GameContent({ onExit, isTestMode, onCameraUpdate }: GameContentProps) {
    return (
      <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
  
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={17.0}
          makeDefault
        />
  
        <Grid size={14} />
        <EnvironmentSphere />
  
        {/* Menu - bottom right, angled 45 degrees inward */}
         {/* Menu - bottom right, angled 45 degrees inward */}
         <Board 
          position={[4.5, 0.3, 3.5]} 
          label=""
          rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
          size={[3, 0.75]}
        />
        <BoardOverlay
          position={[4.5, 0.301, 3.5]}
          rotation={[-Math.PI/4, 0, 0]}
          size={[3, 0.75]}
        />
  
        {/* Actions - bottom left, angled 45 degrees inward */}
        <Board
          position={[-4.5, 0.3, 3.5]} 
          label=""
          rotation={[-Math.PI/4, 0, 0]}  // Rotate -45 degrees around X axis
          size={[3, 0.75]}
        />
        <BoardOverlay
          position={[-4.5, 0.301, 3.5]}
          rotation={[-Math.PI/4, 0, 0]}
          size={[3, 0.75]}
        />
  
        {/* Deck - only show the first card if wireframe is on */}
        {Array.from({ length: 70 }).map((_, index) => (
            <GameCard 
                key={index}
                frontTexture="/cards/cardback.png"
                backTexture="/cards/cardback.png"
                position={[-3.4, 0.0084 * index, 0]} // Start at y=0 and increment by 0.05 for each card
                label=''
                size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
                disableHover={true} // Disable hover effect for Deck Cards
            />
        ))}
  
        {/* Discard - using standard size */}
        <GameCard 
          backTexture="/cards/cardback.png"
          position={[3.4, 0.05, 0]} 
          label=""
          size={CARD_DIMENSIONS.getScaledDimensions(1)} // Standard size
          disableHover={true} // Disable hover effect for Discard
        />
  
        {/* Player 1 Hand x 5 */}
        <GameCard
          backTexture="/cards/cardback.png"
          position={[-1, 0.82, 4]} 
          label=""
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          rotation={[Math.PI/2.2, 0, 0.2]}
        />
         <GameCard 
          backTexture="/cards/cardback.png"
          position={[-0.5, 0.88, 4]} 
          label=""
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          rotation={[Math.PI/2.2, 0, 0.1]}
        />
         <GameCard 
          backTexture="/cards/cardback.png"
          position={[0, 0.9, 4]} 
          label=""
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          rotation={[Math.PI/2.2, 0, 0]} 
        />
         <GameCard 
          backTexture="/cards/cardback.png"
          position={[0.5, 0.88, 4]} 
          label=""
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          rotation={[Math.PI/2.2, 0, -0.1]}
        />
         <GameCard 
          backTexture="/cards/cardback.png"
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          position={[1.0, 0.82, 4]} 
          label=""
          rotation={[Math.PI/2.2, 0, -0.2]}
        />
  
        {/* Player 1 Board */}
        <Board 
          position={[0, 0.05, 1.75]} 
          label=""
          rotation={[-Math.PI/2, 0, 0]}
          size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
        />
        <BoardOverlay
          position={[0, 0.05, 1.75]}
          rotation={[-Math.PI/2, 0, 0]}
          size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
        />
  
        {/* Player 2 Board */}
        <Board 
          position={[0, 0.05, -1.75]} 
          label=""
          rotation={[-Math.PI/2, 0, 0]}
          size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
        />
        <BoardOverlay
          position={[0, 0.05, -1.75]}
          rotation={[-Math.PI/2, 0, 0]}
          size={[12, CARD_DIMENSIONS.getScaledDimensions(1)[1]]}
        />
  
        {/* You can also add specific rotations when needed */}
        <GameCard
          backTexture="/cards/cardback.png"
          position={[-1.0, 0.82, -4]} 
          label=""
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          rotation={[
            -Math.PI/2.2, // Rotation around the X axis (no rotation)
            0, // Rotation around the Y axis (approximately 72 degrees)
            Math.PI/1.05 // Rotation around the Z axis (no rotation)
          ]} // This will flip it 180 degrees around Y axis
        />
  
        <GameCard 
          backTexture="/cards/cardback.png"
          position={[-0.5, 0.88, -4]} 
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          label=""
          rotation={[
            -Math.PI/2.2, // Rotation around the X axis (no rotation)
            0, // Rotation around the Y axis (approximately 72 degrees)
            Math.PI/1.025 // Rotation around the Z axis (no rotation)
          ]} // This will flip it 180 degrees around Y axis
        />
        <GameCard
          backTexture="/cards/cardback.png"
          position={[0, 0.9, -4]} 
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          label=""
          rotation={[
            -Math.PI/2.2, // Rotation around the X axis (no rotation)
            0, // Rotation around the Y axis (approximately 72 degrees)
            Math.PI/1.0 // Rotation around the Z axis (no rotation)
          ]} // This will flip it 180 degrees around Y axis
        />
        <GameCard
          backTexture="/cards/cardback.png"
          position={[0.5, 0.88, -4]} 
          label=""
          size={CARD_DIMENSIONS.getScaledDimensions(1)} 
          rotation={[
            -Math.PI/2.2, // Rotation around the X axis (no rotation)
              0, // Rotation around the Y axis (approximately 72 degrees)
            -Math.PI/1.025 // Rotation around the Z axis (no rotation)
          ]} // This will flip it 180 degrees around Y axis
        />
        <GameCard
          backTexture="/cards/cardback.png"
          position={[1.0, 0.82, -4]} 
          label=""
          rotation={[
            -Math.PI/2.2, // Rotation around the X axis (no rotation)
            0, // Rotation around the Y axis (approximately 72 degrees)
            -Math.PI/1.05 // Rotation around the Z axis (no rotation)
          ]} // This will flip it 180 degrees around Y axis
          size={CARD_DIMENSIONS.getScaledDimensions(1)}
        />
  
        {isTestMode && <CameraStatsBridgeInCanvas onCameraUpdate={onCameraUpdate} />}
      </>
    )
  }