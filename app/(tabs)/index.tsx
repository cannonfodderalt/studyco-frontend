import { registerRootComponent } from 'expo';
import React from 'react';
import MapWrapper from '@/components/map/MapWrapper';

const App = () => {
  return <MapWrapper />;
};

export default App;

registerRootComponent(App);
