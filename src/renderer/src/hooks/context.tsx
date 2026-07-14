import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type GlobalContext = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};
const ShibContextInitialValues: GlobalContext = { loading: false, setLoading: () => {} };
const ShibGlobalContext = createContext<GlobalContext>(ShibContextInitialValues);

export const useShibContext = () => useContext(ShibGlobalContext);

export function ShibContext({
  children,
  additionalValues,
}: {
  children: React.ReactNode;
  additionalValues?: any;
}) {
  const [loading, setLoading] = useState<boolean>(ShibContextInitialValues.loading);

  return (
    <ShibGlobalContext.Provider
      value={{
        loading,
        setLoading,
        ...additionalValues,
      }}
    >
      {children}
    </ShibGlobalContext.Provider>
  );
}