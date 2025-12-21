import type { RootState } from "./store";
import type { IUser } from '@/types/IUser';

export const getModel = (name: string) => (state: RootState) =>
  !!state?.modal?.[name];

export const getData =
  <T = unknown>(name: string) =>
    (state: RootState): T | undefined =>
      state?.data?.[name] as T | undefined;

export const getFlag = (name: string) => (state: RootState) =>
  !!state?.app?.flag?.[name];

export const getApi =
  <T = unknown>(name: string) =>
    (state: RootState): T | undefined =>
      state?.api?.[name] as T | undefined;


export const getUserProfile =
  (state: RootState): IUser | undefined =>
    state?.app?.userProfile;