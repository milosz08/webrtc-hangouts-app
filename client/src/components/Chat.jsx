'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { UniqueOTP } from 'unique-string-generator';
import { useAppContext } from '../context/AppContextProvider';
import { useSocket } from '../context/SocketProvider';
import ConfirmModal from './ConfirmModal';
import CustomButton from './CustomButton';
import Message from './Message';

const Chat = () => {
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useAppContext();

  const messageField = useRef(null);
  const chatBoxContainer = useRef(null);
  const [messages, setMessages] = useState([]);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const sendMessage = () => {
    const messageContent = messageField.current.value;
    if (messageContent) {
      socket.emit('chat:mess-send', {
        roomKey: state.roomKey,
        message: messageContent,
      });
    }
  };

  const clearChat = () => {
    socket.emit('chat:clear', {
      roomKey: state.roomKey,
    });
  };

  const onSnackbarMessageAction = useCallback(
    ({ message }) => enqueueSnackbar(message),
    [enqueueSnackbar]
  );

  const onFetchMessages = useCallback(({ messages }) => {
    setMessages(messages.reverse());
  }, []);

  const onRecvMessage = useCallback(
    newMessages => {
      const modifiedMessages = [newMessages, ...messages];
      setMessages(modifiedMessages);
      messageField.current.value = '';
      chatBoxContainer.scrollTo(0, chatBoxContainer.scrollHeight);
    },
    [messages]
  );

  const onUpdateNickname = useCallback(
    ({ prevNickname, newNickname }) => {
      const modifiedNicknameMessages = messages.map(message => ({
        ...message,
        userNickname:
          prevNickname === message.userNickname
            ? newNickname
            : message.userNickname,
      }));
      setMessages(modifiedNicknameMessages);
    },
    [messages]
  );

  const onClearChat = useCallback(
    ({ message }) => {
      setMessages([]);
      setShowClearConfirmation(false);
      enqueueSnackbar(message);
    },
    [enqueueSnackbar]
  );

  useEffect(() => {
    socket.emit('chat:mess-fetch', { roomKey: state.roomKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    socket.on('chat:fetch-recv', onFetchMessages);
    socket.on('chat:mess-failed', onSnackbarMessageAction);
    socket.on('chat:mess-recv', onRecvMessage);
    socket.on('chat:update-nickname', onUpdateNickname);
    socket.on('chat:clear-res', onClearChat);
    return () => {
      socket.off('chat:fetch-recv', onFetchMessages);
      socket.off('chat:mess-failed', onSnackbarMessageAction);
      socket.off('chat:mess-recv', onRecvMessage);
      socket.off('chat:update-nickname', onUpdateNickname);
      socket.off('chat:clear-res', onClearChat);
    };
  }, [
    socket,
    onFetchMessages,
    onRecvMessage,
    onSnackbarMessageAction,
    onUpdateNickname,
    onClearChat,
  ]);

  const handleKeyDown = event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={clsx(
        'h-full',
        'bg-gradient-to-b',
        'from-custom-blue',
        'via-custom-purple',
        'to-custom-blue',
        'dark:from-dark-blue',
        'dark:via-dark-purple',
        'dark:to-dark-blue border-l-2',
        'dark:border-gray-600'
      )}>
      <div
        className={clsx(
          'w-full',
          'h-[55px]',
          'border-custom-purple',
          'dark:border-gray-600 border-b-2',
          'bg-blue-200',
          'dark:bg-dark-bg flex',
          'justify-end',
          'p-2'
        )}>
        {state.isHost ? (
          <CustomButton
            tagOrComponent="button"
            type="submit"
            onClick={() => setShowClearConfirmation(true)}
            className="max-w-40 bg-red-500 hover:bg-red-600 text-white">
            Clear chat
          </CustomButton>
        ) : null}
      </div>
      <div
        ref={chatBoxContainer}
        className={clsx(
          'py-4',
          'h-[calc(100vh-(66px+55px+134px))]',
          'flex',
          'flex-col-reverse',
          'overflow-y-auto',
          'scrollbar-thin',
          'scrollbar-thumb-purple-400',
          'scrollbar-track-blue-200',
          'dark:scrollbar-thumb-purple-800',
          'dark:scrollbar-track-blue-400',
          'scrollbar-thumb-rounded-full',
          'scrollbar-track-rounded-full',
          'shadow-inner'
        )}>
        {messages.map(({ userSocket, userNickname, message }) => (
          <Message
            key={`${socket.id}-${userNickname}-${UniqueOTP(10)}`}
            message={message}
            isUser={userSocket === socket.id}
            username={userNickname}
          />
        ))}
      </div>
      <div className="border-t-2 dark:border-gray-600 p-2 bg-blue-200 dark:bg-dark-bg">
        <div className="flex flex-col gap-2">
          <textarea
            ref={messageField}
            className={clsx(
              'flex-grow',
              'bg-gray-200',
              'dark:bg-dark-textarea',
              'dark:text-white',
              'resize-none',
              'rounded-md',
              'border-2',
              'dark:border-gray-600',
              'p-2',
              'scrollbar-thin',
              'scrollbar-thumb-purple-400',
              'scrollbar-track-blue-200',
              'dark:scrollbar-thumb-purple-800',
              'dark:scrollbar-track-blue-400',
              'scrollbar-thumb-rounded-full',
              'scrollbar-track-rounded-full',
              'shadow-inner'
            )}
            placeholder="Type message..."
            onKeyDown={handleKeyDown}
          />
          <div className="justify-end flex">
            <CustomButton
              tagOrComponent="button"
              type="submit"
              onClick={sendMessage}>
              Send
            </CustomButton>
          </div>
        </div>
      </div>
      {showClearConfirmation ? (
        <ConfirmModal
          handleNeg={clearChat}
          handlePos={() => setShowClearConfirmation(false)}
          question="Are you sure you want to clear meeting chat?"
          pos="Keep messages"
          neg="Clear chat"
        />
      ) : null}
    </div>
  );
};

export default Chat;
