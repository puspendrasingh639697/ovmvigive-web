

import { supabase } from '../../firebase/supabaseClient';

/**
 
Updates the typing status for a user in a chat document.
@param {string} chatId - The Firestore document ID of the chat.
@param {string} email - The user's email.
@param {boolean} isTyping - Whether the user is typing or not.*/






export const setTypingStatus = async (chatId, email, isTyping) => {
  try {
    if (!chatId || !email) return;

    const safeEmail = email.replace(/[.@]/g, "_");

    const { error } = await supabase
      .from("chats")
      .update({
        typing: {
          [safeEmail]: isTyping
        },
        typing_updated_at: new Date().toISOString()
      })
      .eq("id", chatId);

    if (error) {
      console.error("Typing update error:", error);
    } else {
      console.log(`✅ Typing set: ${safeEmail} → ${isTyping}`);
    }

  } catch (e) {
    console.error("Typing error:", e);
  }
};