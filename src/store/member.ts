import { atom, selector } from 'recoil';

import { getAuthorizedOptionHeaders } from '../api/authorizedOptionHeaders';
import { getMemberAPI } from '../api/memberAPI';
import { Member, MemberInformation } from '../types';
import { currentServerState } from './server';

const currentMemberState = atom<Member>({
  key: 'currentMember',
  default: {
    username: process.env.REACT_APP_API_USERNAME_1!,
    password: process.env.REACT_APP_API_PASSWORD_1!,
  },
});

const currentMemberInformationState = atom<MemberInformation>({
  key: 'currentMemberInformation',
  default: selector({
    key: 'currentMemberInformation/default',
    get: ({ get }) => {
      const currentServer = get(currentServerState);
      const currentMember = get(currentMemberState);
      const authorizedHeaders = getAuthorizedOptionHeaders(currentMember);

      const memberAPI = getMemberAPI(currentServer, authorizedHeaders);

      return memberAPI.getMemberInfo();
    },
  }),
});

export { currentMemberState, currentMemberInformationState };
