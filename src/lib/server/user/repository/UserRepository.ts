export default interface UserRepository {
  getUserId(username: string): Promise<string | null>;
  getUsername(userId: string): Promise<string | null>;
}
