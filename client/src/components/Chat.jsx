'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import Message from './Message';

const Chat = () => {
  return (
    <div className="flex flex-col h-full min-h-72 bg-gradient-to-b from-[#BFDCE6] via-[#C6C1D6] to-[#BFDCE6] dark:from-[#0D2238] dark:via-[#241B36] dark:to-[#0D2238] border-l-2 border-[#C6C1D6] dark:border-gray-600">
      <div className="w-full h-10 border-[#C6C1D6] dark:border-gray-600 border-b-2 bg-blue-200 dark:bg-[#0A1C2B]"></div>
      <div className="flex-1 overflow-auto py-4">
        <Message message="Piwka nie można" isUser={false} username="cwl" />
        <Message message="Wysiadamy" isUser={true} username="ty" />
      </div>
      <div className="border-t-2 border-[#C6C1D6] dark:border-gray-600 p-2 bg-blue-200 p-2 dark:bg-[#0A1C2B]">
        <div className="flex flex-col gap-2">
          <textarea
            className="flex-grow rounded-md border-2 border-[#C6C1D6] dark:border-gray-600 p-2 bg-gray-200 dark:bg-[#1A314E] dark:text-white resize-none"
            placeholder="Wpisz wiadomość..."
          />
          <div className="justify-end flex">
            <button className="text-white bg-gradient-to-br from-purple-500 to-blue-400 dark:from-purple-800 dark:to-blue-400 font-medium rounded-lg text-sm px-10 py-2.5 text-center hover:from-purple-600 hover:to-blue-500 dark:hover:from-purple-900 dark:hover:to-blue-500 active:from-purple-700 active:to-blue-600 dark:active:from-purple-1000 dark:active:to-blue-600">
              Wyślij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
