import { UserService } from "$lib/server/user/UserService";
import type { LayoutServerLoad } from "./$types";

const userService: UserService = UserService.getInstance();

export const load: LayoutServerLoad = async ({ params }) => {
  const username: string = params.username;
  console.log(`Loading profile for user: ${username}`);
  let userId: string | null = null;

  try {
    userId = await userService.getUserId(username);
  } catch (err) {
    console.error(`Profile doesn't exist!`);
  }

  return {
    profile: {
      username,
      userId
    }
  };
};
