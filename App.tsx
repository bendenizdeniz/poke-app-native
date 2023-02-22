import React from 'react';
import { Main } from './components/Main';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { atom } from 'jotai';
import { IPokemon } from './utils/Interfaces';

export const pokeAtom = atom([] as IPokemon[]);

function App(): JSX.Element {

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'tomato',
      secondary: 'yellow',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Main />
    </PaperProvider>
  );
}

export default App;
