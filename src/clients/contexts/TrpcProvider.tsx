"use client";

import { trpcClient } from "~/trpc/client/trpc-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const TrpcProvider = (props: { children: React.ReactNode }) => {
  return (
    <trpcClient.Provider>
      {props.children}
      <ReactQueryDevtools initialIsOpen={false} />
    </trpcClient.Provider>
  );
};
export default TrpcProvider;
