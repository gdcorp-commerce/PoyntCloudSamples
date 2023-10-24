import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface ResourcesContextProps {
  scope: string;
  client_id: string;
  client_secret: string;
  env: string;
  ssoUri: string;
  appName: string;
  appId: string;
  scopes: string[];
  stores: string[];
  loadingStores: boolean;
}

interface ResourcesProviderProps {
  children: React.ReactNode;
}

export const ResourcesContext = createContext<ResourcesContextProps>(
  {} as ResourcesContextProps
);

export const ResourcesProvider = ({ children }: ResourcesProviderProps) => {
  const appName = "quicktest11";
  const appId = "urn:aid:5927acda-f584-4723-97ed-e29bb3f3eb9c";
  const clientId = "c9c62f88-0b3f-430c-8b50-3e375f9cc7a1";
  const clientSecret = "RyEiVQJawqVCjiPgh2LJAHp0GEwZSOWC";
  const env = "development";
  const ssoUri = `https://sso.dev-godaddy.com/authorize?client_id=${clientId}&scope=commerce.order:read%20commerce.order:create&redirect_uri=https%3A%2F%2Fwww.bar.com`;
  const [stores, setStores] = useState<string[]>([]);
  const [scopes, setScopes] = useState<string[]>(["default.scope.value"]); // Default value for scopes
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (window.location.pathname.includes("actions")) {
      const storeIdsFromLocalStorage = localStorage.getItem("storeIds");
      if (storeIdsFromLocalStorage) {
        const parsedStores = JSON.parse(storeIdsFromLocalStorage);
        if (JSON.stringify(parsedStores) !== JSON.stringify(stores)) {
          setStores(parsedStores);
        }
      } else if (!window.location.search.includes("resourceIds")) {
        window.location.href = "/";
      } else if (window.location.search.includes("resourceIds")) {
        const { scopes: extractedScopes, storeIds } =
          extractIdsAndScopesFromCurrentURL();

        if (storeIds && JSON.stringify(storeIds) !== JSON.stringify(stores)) {
          localStorage.setItem("storeIds", JSON.stringify(storeIds));
          setStores(storeIds);
        }

        if (extractedScopes && extractedScopes.length > 0) {
          setScopes(extractedScopes);
        }
      }
    }
    setLoading(false);
  }, []);

  const context = useMemo(
    () => ({
      ssoUri,
      client_id: clientId,
      client_secret: clientSecret,
      env,
      scope: "commerce.order:read",
      appName,
      appId,
      scopes,
      stores,
      loadingStores: loading,
    }),
    [stores, scopes]
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
  const url = window.location.href;

  const resourceIdsParam = new URLSearchParams(new URL(url).search).get(
    "resourceIds"
  );
  const storeIds = resourceIdsParam?.split(",");

  const scopeParam = new URLSearchParams(new URL(url).search).get("scope");
  const extractedScopes = scopeParam
    ?.split(",")
    .map((scope) => decodeURIComponent(scope));

  return { storeIds, scopes: extractedScopes || [] }; // Return empty array if no scopes are found
}
