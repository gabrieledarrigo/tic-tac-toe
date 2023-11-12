/**
 * A generic repository interface for persisting and retrieving entities.
 * @template T The type of entity being persisted and retrieved.
 * @template ID The type of the entity's identifier.
 */
export interface Repository<T, ID> {
  /**
   * Generates the next identity for the entity.
   * @returns The next identity.
   */
  nextIdentity(): ID;

  /**
   * Gets the entity with the specified id.
   * @param id The id of the entity to get.
   * @returns The entity with the specified id, or null if not found.
   */
  byId(id: ID): Promise<T | null>;

  /**
   * Persists the entity.
   * @param entity The entity to persist.
   */
  persist(entity: T): Promise<void>;
}
