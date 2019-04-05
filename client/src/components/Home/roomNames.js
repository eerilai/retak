const roomNames = [
  'Abbotts_Ford',
  'Ankers',
  'Baedn_Byrt',
  'Broken_Binding',
  'Crosson',
  'Eolian',
  'Evesdown',
  'Feant',
  'Haert',
  'Half_Mast',
  'Hallowfell',
  'Hillside',
  'Horse_and_Four',
  'Imre',
  'Junpui',
  'Levinshir',
  'Marrow',
  'Medica',
  'Myr_Tariniel',
  'Newarre',
  'Pennysworth',
  'Ralien',
  'Rannish',
  'Renere',
  'Seaward_Square',
  'Severen',
  'Stonebridge',
  'Tarbean',
  'Tinue',
  'Trebon',
  'Waterside',
  'Waystone',
];

const generateRoomName = () => {
  const placeName = roomNames[Math.floor(Math.random() * roomNames.length)];
  return `${placeName}-${Math.random().toString(36).slice(2, 5)}`;
};

export default generateRoomName;
