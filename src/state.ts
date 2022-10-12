import { useState } from 'react';
import { createContainer } from 'react-tracked';

const initialState = {
    gameList: {},
    selectedGame: "",
    profileList: {},
    selectedProfile: "",
    savestateList: {},
    selectedSavestate: ""
};

const useMyState = () => useState(initialState);

export const { Provider: SharedStateProvider, useTracked: useSharedState } =
  createContainer(useMyState);