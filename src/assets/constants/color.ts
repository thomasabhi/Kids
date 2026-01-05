// src/constants/colors.ts

// export const COLORS = {
//   // Backgrounds
//   lavenderBG: '#F3E5F5',
//   skyBlueBG: '#E3F2FD',
//   mintBG: '#F1F8E9',

//   // Brand Colors
//   primary: '#9C27B0',      // Deep Purple for text/active states
//   secondary: '#03A9F4',    // Bright Blue for Vehicles
//   accent: '#FFD700',       // Gold for the "Rim" and Rewards
  
//   // UI Elements
//   white: '#FFFFFF',
//   black: '#212121',
//   error: '#FF5252',
//   success: '#4CAF50',

//   // Neumorphic Shadows
//   shadowLight: '#FFFFFF',
//   shadowDark: '#BEBEBE',
  
//   // Category Specific
//   animalTheme: '#BA68C8',
//   vehicleTheme: '#4FC3F7',
//   codingTheme: '#81C784'
// };


export interface AlphabetItem {
  _id: string;
  type: 'letter';
  title: string;
  question: string;
  imageKey: string;
  soundKey: string;
}

// export const alphabetData: AlphabetItem[] = [
//   { _id: '1', type: 'letter', title: 'A', question: 'A for Apple', imageKey: 'A', soundKey: 'A' },
//   { _id: '2', type: 'letter', title: 'B', question: 'B for Ball', imageKey: 'B', soundKey: 'B' },
//   { _id: '3', type: 'letter', title: 'C', question: 'C for Cat', imageKey: 'C', soundKey: 'C' },
//   { _id: '4', type: 'letter', title: 'D', question: 'D for Dog', imageKey: 'D', soundKey: 'D' },
//   { _id: '5', type: 'letter', title: 'E', question: 'E for Elephant', imageKey: 'E', soundKey: 'E' },
//   { _id: '6', type: 'letter', title: 'F', question: 'F for Fish', imageKey: 'F', soundKey: 'F' },
//   { _id: '7', type: 'letter', title: 'G', question: 'G for Goat', imageKey: 'G', soundKey: 'G' },
//   { _id: '8', type: 'letter', title: 'H', question: 'H for Horse', imageKey: 'H', soundKey: 'H' },
//   { _id: '9', type: 'letter', title: 'I', question: 'I for Ice Cream', imageKey: 'I', soundKey: 'I' },
//   { _id: '10', type: 'letter', title: 'J', question: 'J for Jam', imageKey: 'J', soundKey: 'J' },
//   { _id: '11', type: 'letter', title: 'K', question: 'K for Kite', imageKey: 'K', soundKey: 'K' },
//   { _id: '12', type: 'letter', title: 'L', question: 'L for Lion', imageKey: 'L', soundKey: 'L' },
//   { _id: '13', type: 'letter', title: 'M', question: 'M for Monkey', imageKey: 'M', soundKey: 'M' },
//   { _id: '14', type: 'letter', title: 'N', question: 'N for Nest', imageKey: 'N', soundKey: 'N' },
//   { _id: '15', type: 'letter', title: 'O', question: 'O for Orange', imageKey: 'O', soundKey: 'O' },
//   { _id: '16', type: 'letter', title: 'P', question: 'P for Parrot', imageKey: 'P', soundKey: 'P' },
//   { _id: '17', type: 'letter', title: 'Q', question: 'Q for Queen', imageKey: 'Q', soundKey: 'Q' },
//   { _id: '18', type: 'letter', title: 'R', question: 'R for Rabbit', imageKey: 'R', soundKey: 'R' },
//   { _id: '19', type: 'letter', title: 'S', question: 'S for Sun', imageKey: 'S', soundKey: 'S' },
//   { _id: '20', type: 'letter', title: 'T', question: 'T for Tiger', imageKey: 'T', soundKey: 'T' },
//   { _id: '21', type: 'letter', title: 'U', question: 'U for Umbrella', imageKey: 'U', soundKey: 'U' },
//   { _id: '22', type: 'letter', title: 'V', question: 'V for Violin', imageKey: 'V', soundKey: 'V' },
//   { _id: '23', type: 'letter', title: 'W', question: 'W for Watch', imageKey: 'W', soundKey: 'W' },
//   { _id: '24', type: 'letter', title: 'X', question: 'X for Xylophone', imageKey: 'X', soundKey: 'X' },
//   { _id: '25', type: 'letter', title: 'Y', question: 'Y for Yacht', imageKey: 'Y', soundKey: 'Y' },
//   { _id: '26', type: 'letter', title: 'Z', question: 'Z for Zebra', imageKey: 'Z', soundKey: 'Z' },
// ];

export const COLORS: { [key: string]: string } = {
  A: '#FF5252',
  B: '#2196F3',
  C: '#FF9800',
  D: '#9C27B0',
  E: '#4CAF50',
  F: '#FF5722',
  G: '#3F51B5',
  H: '#009688',
  I: '#E91E63',
  J: '#00BCD4',
  K: '#FFC107',
  L: '#8BC34A',
  M: '#673AB7',
  N: '#CDDC39',
  O: '#FFEB3B',
  P: '#795548',
  Q: '#607D8B',
  R: '#F44336',
  S: '#03A9F4',
  T: '#FF9800',
  U: '#4CAF50',
  V: '#9C27B0',
  W: '#2196F3',
  X: '#E91E63',
  Y: '#FFC107',
  Z: '#00BCD4',
  DEFAULT: '#8BC34A',
};