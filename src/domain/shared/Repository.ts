/**
 * Interface for repositories that have a method to generate the next identity.
 */
export interface WithNextIdentity<ID> {
  /**
   * Generates the next identity for the entity.
   * @returns The next identity.
   */
  nextIdentity(): ID;
}
