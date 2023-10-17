"use client";
import CommerceSdk from "@gdcorp-commerce/commerce-sdk";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ResourcesContextProps {
  store_id: string;
  scope: string;
  client_id: string;
  client_secret: string;
  env: string;
  ssoUri: string;
  appName: string;
  appId: string;
  scopes: string[];
  stores: string[];
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
  const storeId = "acf9f7fa-b4d8-4a64-aac6-f11000c1c63b";
  const clientId = "c9c62f88-0b3f-430c-8b50-3e375f9cc7a1";
  const clientSecret = "RyEiVQJawqVCjiPgh2LJAHp0GEwZSOWC";
  const env = "development";
  const ssoUri = `https://sso.dev-godaddy.com/authorize?client_id=${clientId}&scope=commerce.order:read%20commerce.order:create&redirect_uri=https%3A%2F%2Fwww.bar.com`;
  const [stores, setStores] = useState<string[]>([
    "acf9f7fa-b4d8-4a64-aac6-f11000c1c63b",
    "4c5e697f-400a-412c-b6b7-dedcc17602ff",
  ]);
  const [scopes, setScopes] = useState<string[]>([
    "commerce.order:create",
    "commerce.order:read",
  ]);

  useEffect(() => {
    if (window.location.pathname.includes("actions")) {
      const { scopes, storeIds } = extractIdsAndScopesFromCurrentURL();
      if (storeIds && scopes) {
        setStores(storeIds);
        setScopes(scopes);
      }
    }
  }, []);

  const context = useMemo(
    () => ({
      store_id: storeId,
      ssoUri,
      client_id: clientId,
      client_secret: clientSecret,
      env,
      //scope,
      scope: "commerce.order:read",
      appName,
      appId,
      scopes,
      stores,
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

function extractIdsAndScopesFromCurrentURL() {
  // const url = window.location.href;
  // const url =
  //   "https://www.bar.com/?resourceIds=acf9f7fa-b4d8-4a64-aac6-f11000c1c63b%2C4c5e697f-400a-412c-b6b7-dedcc17602ff&scope=commerce.order%3Acreate%2Ccommerce.order%3Aread&success=true";
  // Extract resourceIds from the URL
  const resourceIdsParam = new URLSearchParams(
    new URL(
      "https://www.bar.com/?resourceIds=acf9f7fa-b4d8-4a64-aac6-f11000c1c63b%2C4c5e697f-400a-412c-b6b7-dedcc17602ff&scope=commerce.order%3Acreate%2Ccommerce.order%3Aread&success=true"
    ).search
  ).get("resourceIds");
  const storeIds = resourceIdsParam?.split(",");

  // Extract scopes from the URL
  const scopeParam = new URLSearchParams(
    new URL(
      "https://www.bar.com/?resourceIds=acf9f7fa-b4d8-4a64-aac6-f11000c1c63b%2C4c5e697f-400a-412c-b6b7-dedcc17602ff&scope=commerce.order%3Acreate%2Ccommerce.order%3Aread&success=true"
    ).search
  ).get("scope");
  const scopes = scopeParam
    ?.split(",")
    .map((scope) => decodeURIComponent(scope));

  return { storeIds, scopes };
}
