"use client";
import { createContext, useCallback, useContext, useMemo } from "react";

interface ResourcesContextProps {
  store_id: string;
  scope: string;
  client_id: string;
  client_secret: string;
  env: string;
  ssoUri: string;
  appName: string;
  appId: string;
}

interface ResourcesProviderProps {
  children: React.ReactNode;
}

export const ResourcesContext = createContext<ResourcesContextProps>(
  {} as ResourcesContextProps
);

export const ResourcesProvider = ({ children }: ResourcesProviderProps) => {
  // miguel store id
  const appName = "quicktest11";
  const appId = "urn:aid:5927acda-f584-4723-97ed-e29bb3f3eb9c";
  const storeId = "4c5e697f-400a-412c-b6b7-dedcc17602ff";
  const ssoUri =
    "https://sso.dev-godaddy.com/authorize?client_id=c9c62f88-0b3f-430c-8b50-3e375f9cc7a1&scope=commerce.order:create&redirect_uri=https%3A%2F%2Fwww.bar.com";
  const clientId = "c9c62f88-0b3f-430c-8b50-3e375f9cc7a1";
  const clientSecret = "";
  const env = "development";
  const scope = "commerce.order:create";

  const context = useMemo(
    () => ({
      store_id: storeId,
      ssoUri,
      client_id: clientId,
      client_secret: clientSecret,
      env,
      scope,
      appName,
      appId,
    }),
    []
  );

  return (
    <ResourcesContext.Provider value={context}>
      {children}
    </ResourcesContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourcesContext);

  if (!context) {
    throw new Error("useResources must be used within a ResourcesProvider");
  }

  return context;
};
