const roomNames = [
  'Abbotts-Ford',
  'Ankers',
  'Baedn-Byrt',
  'Broken-Binding',
  'Crosson',
  'Eolian',
  'Evesdown',
  'Feant',
  'Haert',
  'Half-Mast',
  'Hallowfell',
  'Hillside',
  'Horse-and-Four',
  'Imre',
  'Junpui',
  'Levinshir',
  'Marrow',
  'Medica',
  'Myr-Tariniel',
  'Newarre',
  'Pennysworth',
  'Ralien',
  'Rannish',
  'Renere',
  'Seaward-Square',
  'Severen',
  'Stonebridge',
  'Tarbean',
  'Tinuë',
  'Trebon',
  'Waterside',
  'Waystone'
];

const generateRoomName = () => {
  const placeName = roomNames[Math.floor(Math.random() * roomNames.length)];
  return `${placeName}-${Math.random().toString(36).slice(2,5)}`
};

export default generateRoomName;