import React, { createContext, ReactNode, useContext, useState } from 'react';

interface IMapInteractionCtx {
  idFromDrag: string;
  setIdFromDrag: React.Dispatch<React.SetStateAction<string>>;
  idFromMap: string;
  setIdFromMap: React.Dispatch<React.SetStateAction<string>>;
  distance: number;
  setDistance: React.Dispatch<React.SetStateAction<number>>;
}

const MapInteractionCtx = createContext<Partial<IMapInteractionCtx>>({});

interface IMapInteractionCtxProvideProps {
  children: ReactNode;
}

export const MapInteractionCtxProvider: React.FC<IMapInteractionCtxProvideProps> = ({
  children,
}) => {
  const [idFromDrag, setIdFromDrag] = useState('');
  const [idFromMap, setIdFromMap] = useState('');
  const [distance, setDistance] = useState(0);
  return (
    <MapInteractionCtx.Provider
      value={{
        idFromDrag,
        setIdFromDrag,
        idFromMap,
        setIdFromMap,
        distance,
        setDistance,
      }}
    >
      {children}
    </MapInteractionCtx.Provider>
  );
};

export const useStepIdContext = () => {
  const { idFromDrag, setIdFromDrag, idFromMap, setIdFromMap } = useContext(
    MapInteractionCtx,
  );
  if (
    idFromDrag === undefined ||
    setIdFromDrag === undefined ||
    idFromMap === undefined ||
    setIdFromMap === undefined
  ) {
    throw new Error();
  }
  return { idFromDrag, setIdFromDrag, idFromMap, setIdFromMap };
};

export const useDistanceContext = () => {
  const { distance, setDistance } = useContext(MapInteractionCtx);
  if (distance === undefined || setDistance === undefined) {
    throw new Error();
  }
  return { distance, setDistance };
};
