export interface RegisteredFaceRepository {
  existsByName(name: string): Promise<boolean>;
  register(name: string): Promise<boolean>;
}
