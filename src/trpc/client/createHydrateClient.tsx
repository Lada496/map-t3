"use client";

import { type DehydratedState, Hydrate } from "@tanstack/react-query";
import { type DataTransformer } from "@trpc/server";
import { useMemo } from "react";

export function createHydrateClient(opts: { transformer?: DataTransformer }) {
  return function HydrateClient(props: {
    children: React.ReactNode;
    state: DehydratedState;
  }) {
    const { state, children } = props;

    // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
    const transformedState: DehydratedState = useMemo(() => {
      if (opts.transformer) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return opts.transformer.deserialize(state);
      }
      return state;
    }, [state]);
    return <Hydrate state={transformedState}>{children}</Hydrate>;
  };
}
