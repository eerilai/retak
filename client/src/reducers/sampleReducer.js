const initialState = {
  fetching: false,
  fetched:false,
  players: [],
  moves:[],
  items: [],
  item: {},
  error: null
}

export default function() {
  return [
    { sampleDataTitle: 'Some Data Title' },
    {anotherTitle: 'Other Title'}
  ]
}