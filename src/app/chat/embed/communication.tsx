import React, { createContext, useContext, useState, useEffect } from 'react';

import { connectToParent, AsyncMethodReturns } from 'penpal'
import type { ParentApi, ChildApi, EmbedContext } from '@/embed/api'

export const useEmbedCommunication = (): [ParentApi | null, EmbedContext | null] => {
    const [ api, setParent ] = useState<AsyncMethodReturns<ParentApi> | null>(null)
    const [ context, setContext ] = useState<EmbedContext | null>(null)

    useEffect(() => {
        connectToParent<ParentApi>({
            methods: {
                setEmbedContext(context: EmbedContext) {
                    setContext(context)
                }
            } satisfies ChildApi,
        }).promise.then(function (parent): void {
            setParent(parent)
        })
    }, [])

    return [api, context]
}


interface EmbedCommunicationContextData {
  api: ParentApi | null;
  context: EmbedContext | null;
}

// Create the context with a default value
const EmbedCommunicationContext = createContext<EmbedCommunicationContextData | null>(null);

// Export the context to allow useContext in other components
export const useEmbedCommunicationContext = () => useContext(EmbedCommunicationContext) || { api: null, context: null};

interface EmbedCommunicationProviderProps {
  children: React.ReactNode;
}

export const EmbedCommunicationProvider: React.FC<EmbedCommunicationProviderProps> = ({ children }) => {
  const [api, setParent] = useState<AsyncMethodReturns<ParentApi> | null>(null);
  const [context, setContext] = useState<EmbedContext | null>(null);

  useEffect(() => {
    connectToParent<ParentApi>({
      methods: {
        setEmbedContext(context: EmbedContext) {
          setContext(context);
        },
      }, // Assume this satisfies ChildApi without explicit type assertion in this context
    }).promise.then(function (parent): void {
      setParent(parent);
    });
  }, []);

  // Wrap the children in the provider with the current state
  return (
    <EmbedCommunicationContext.Provider value={{ api, context }}>
      {children}
    </EmbedCommunicationContext.Provider>
  );
};
