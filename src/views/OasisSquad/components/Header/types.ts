import { EventInfos, UserInfos, UserStatusEnum } from 'views/OasisSquad/types'

export type OasisSquadHeaderType = {
  account: string
  isLoading: boolean
  eventInfos?: EventInfos
  userInfos?: UserInfos
  userStatus: UserStatusEnum
}

export enum ButtonsEnum {
  ACTIVATE,
  BUY,
  MINT,
  END,
  NONE,
}
