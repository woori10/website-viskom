export function countFingers(landmarks: any) {
  let count = 0;

  // index
  if (landmarks[8].y < landmarks[6].y) count++;

  // middle
  if (landmarks[12].y < landmarks[10].y) count++;

  // ring
  if (landmarks[16].y < landmarks[14].y) count++;

  // pinky
  if (landmarks[20].y < landmarks[18].y) count++;

  return count;
}
