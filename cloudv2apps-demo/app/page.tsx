"use client";
import { useResources } from "@/context/resources";
import CommerceSdk from "@gdcorp-commerce/commerce-sdk";

export default function Home() {
  const { ssoUri } = useResources();

  const handleRedirectToSSO = () => {
    window.location.href = ssoUri;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-16">
        <h1 className="text-4xl font-bold">Cloud V2 Apps Demo</h1>
        <button
          onClick={() => handleRedirectToSSO()}
          className="bg-transparent border border-white text-white px-12 py-3 rounded hover:bg-white hover:border-black hover:text-black cursor-pointer"
        >
          Click here to have access to this app
        </button>
      </div>
    </main>
  );
}
