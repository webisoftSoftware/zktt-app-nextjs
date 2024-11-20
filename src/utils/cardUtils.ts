import { cardImages } from '../components/vfx/CardSprite';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a randomized version of cardImages that we'll export
export const randomizedCardImages = shuffleArray(cardImages);

// Helper function to get next card (cycles through the randomized array)
let currentCardIndex = 0;
export const getNextRandomCard = (): string => {
  const card = randomizedCardImages[currentCardIndex];
  currentCardIndex = (currentCardIndex + 1) % randomizedCardImages.length;
  return card;
}