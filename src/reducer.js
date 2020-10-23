export const initialState = {
  CITIES: JSON.parse(localStorage.getItem("cities")) || [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CITY":
      return {
        ...state,
        CITIES: [
          ...state.CITIES,
          {
            name: action.name,
            country: action.country,
            temprature: action.temprature,
          },
        ],
      };
    case "UPDATE_CITIES":
      return {
        ...state,
        CITIES: state.CITIES.map((city) => {
          if (city.name == action.name) {
            return {
              ...city,
              temprature: action.temp,
            };
          } else {
            return {
              ...city,
            };
          }
        }),
      };
    case "DELETE_CITY":
      return {
        ...state,
        CITIES: state.CITIES.filter((city) => city.name !== action.name),
      };
    default:
      return state;
  }
};

export default reducer;
