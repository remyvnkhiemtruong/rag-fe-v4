// Chat Page Component
import { ChatWindow } from "../components/ChatWindow";

export default function ChatPage() {
  return (
    <div className="flex flex-col flex-1 w-full min-h-[calc(100vh-6rem)] py-2 sm:py-3">
      <ChatWindow />
    </div>
  );
}