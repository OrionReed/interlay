import { useContext, useEffect, useState } from "react";
import { CollectionContext } from "./CollectionProvider";
import { BaseCollection } from "./BaseCollection";

export const useCollection = <T extends BaseCollection = BaseCollection>(collectionId: string): { collection: T; size: number } | undefined => {
  const context = useContext(CollectionContext);
  const [collectionState, setCollectionState] = useState<{ collection: T; size: number } | undefined>(undefined);

  useEffect(() => {
    if (!context) {
      console.error("CollectionContext not found.");
      return;
    }

    const collection = context.get(collectionId) as T | undefined;
    if (!collection) {
      // Initially, or if the collection does not exist, the state remains undefined.
      setCollectionState(undefined);
      return;
    }

    // If the collection is found, set the initial state.
    setCollectionState({ collection, size: collection.size });

    // Subscribe to collection changes to update the size.
    const unsubscribe = collection.subscribe(() => {
      setCollectionState(currentState => {
        if (!currentState) return undefined; // Guard against the component unmounting
        return { ...currentState, size: collection.size };
      });
    });

    // Cleanup subscription on unmount or if the collectionId changes.
    return () => unsubscribe();
  }, [context, collectionId]);

  return collectionState;
};

