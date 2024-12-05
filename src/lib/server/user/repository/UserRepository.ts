export default interface UserRepository {
  getUserId(username: string): Promise<string | null>;
}
