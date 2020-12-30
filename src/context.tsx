import React, { createContext, ReactNode, useContext, useState } from 'react';

interface IStepIdContext {
  idFromDrag: string;
  setIdFromDrag: React.Dispatch<React.SetStateAction<string>>;
  idFromMap: string;
  setIdFromMap: React.Dispatch<React.SetStateAction<string>>;
}

const StepIdContext = createContext<Partial<IStepIdContext>>({});

interface IStepIdContextProvideProps {
  children: ReactNode;
}

export const StepIdContextProvider: React.FC<IStepIdContextProvideProps> = ({
  children,
}) => {
  const [idFromDrag, setIdFromDrag] = useState('');
  const [idFromMap, setIdFromMap] = useState('');
  return (
    <StepIdContext.Provider
      value={{ idFromDrag, setIdFromDrag, idFromMap, setIdFromMap }}
    >
      {children}
    </StepIdContext.Provider>
  );
};

export const useStepIdContext = () => {
  const { idFromDrag, setIdFromDrag, idFromMap, setIdFromMap } = useContext(
    StepIdContext,
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
