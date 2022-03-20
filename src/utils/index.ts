import { IMessage, IMessenger } from '../../types';

export const messageIsBetween = (
  message: IMessage,
  messenger1: IMessenger,
  messenger2: IMessenger
): boolean => {
  // Either if it is from messenger1 to messenger2
  if (
    message.from.uuid === messenger1.uuid &&
    message.to.uuid === messenger2.uuid
  )
    return true;
  // Or if it is from messenger2 to messenger1
  if (
    message.from.uuid === messenger2.uuid &&
    message.to.uuid === messenger1.uuid
  )
    return true;

  return false;
};

export const messageIsTo = (
  message: IMessage,
  messenger: IMessenger
): boolean => {
  return message.to.uuid === messenger.uuid;
};
