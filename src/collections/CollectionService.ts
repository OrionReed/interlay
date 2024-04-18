import { BaseCollection } from './BaseCollection';

class CollectionsServiceClass {
  private collections: Map<string, BaseCollection> | undefined;

  setCollections(collections: Map<string, BaseCollection>) {
    this.collections = collections;
  }

  getCollection(id: string): BaseCollection | undefined {
    return this.collections?.get(id);
  }

  getAllCollections(): BaseCollection[] | undefined {
    return this.collections ? Array.from(this.collections.values()) : undefined;
  }
}

// Export as a singleton
export const CollectionsService = new CollectionsServiceClass();