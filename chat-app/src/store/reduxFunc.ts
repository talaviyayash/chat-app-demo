import type { RootState } from "./store";
import type { IUser } from '@/types/IUser';


export const getUserProfile =
  (state: RootState): IUser | undefined =>
    state?.app?.userProfile;