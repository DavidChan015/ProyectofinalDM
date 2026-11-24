export interface DatabaseHealthRepository {
  checkConnection(): Promise<void>;
}
