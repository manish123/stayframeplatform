type MessageType = 'noImage' | 'maxText' | 'noTemplate' | 'saveSuccess' | 'autoSave' | 'networkError' | 'general';

interface FunMessage {
  message: string;
  action?: string;
  actionVariant?: 'default' | 'destructive' | 'outline' | 'ghost';
  icon?: string;
}

export const getRandomMessage = (type: MessageType = 'general'): FunMessage => {
  const messages: Record<MessageType, FunMessage[]> = {
    noImage: [
      {
        message: "This template is camera shy! It's all about the words. ✍️",
        action: "Got it, let's write!",
        actionVariant: 'default',
        icon: 'text'
      },
      {
        message: "No image spot here - it's a text-only zone!",
        action: "Focus on text →",
        actionVariant: 'outline',
        icon: 'type'
      },
      {
        message: "This template keeps it minimal - no images, just pure wisdom.",
        action: "Let's write!",
        actionVariant: 'default',
        icon: 'pen-tool'
      },
      {
        message: "Who needs images when your words can paint a thousand pictures?",
        action: "Make them count!",
        actionVariant: 'outline',
        icon: 'palette'
      },
      {
        message: "Text is the new black! This template is strictly typography. ✨",
        action: "Let's type!",
        actionVariant: 'default',
        icon: 'keyboard'
      }
    ],
    noTemplate: [
      {
        message: "Hold up! You're trying to run before we've built the track. 🏃‍♂️💨",
        action: "Pick a template",
        actionVariant: 'default',
        icon: 'layout-template'
      },
      {
        message: "Let's not put the cart before the horse!",
        action: "Choose template first",
        actionVariant: 'outline',
        icon: 'list-ordered'
      },
      {
        message: "Step 1: Template. Step 2: Quote. You're on step 2. 🤔",
        action: "Back to step 1",
        actionVariant: 'outline',
        icon: 'arrow-left'
      },
      {
        message: "Template first, then quote. It's the circle of life! 🌍",
        action: "Pick template",
        actionVariant: 'default',
        icon: 'file-edit'
      },
      {
        message: "Whoops! You've jumped straight to the middle of the story. 📖",
        action: "Start from the beginning",
        actionVariant: 'default',
        icon: 'rewind'
      }
    ],
    maxText: [
      {
        message: "Whoa there, Shakespeare! One text box to rule them all. 🎭",
        action: "Edit text",
        actionVariant: 'outline',
        icon: 'edit'
      },
      {
        message: "Text limit reached! Your words are powerful, but let's keep it concise. ✨",
        action: "Got it",
        actionVariant: 'default',
        icon: 'zap'
      },
      {
        message: "This template believes in quality over quantity!",
        action: "Edit existing text",
        actionVariant: 'outline',
        icon: 'edit-3'
      }
    ],
    saveSuccess: [
      {
        message: "All changes saved! Your masterpiece is safe with us. 💾",
        icon: 'check-circle'
      },
      {
        message: "Auto-saved! Your creativity is preserved. ✨",
        icon: 'save'
      },
      {
        message: "Progress saved! Keep creating. 🎨",
        icon: 'check'
      }
    ],
    autoSave: [
      {
        message: "Auto-saved your latest changes.",
        icon: 'clock'
      },
      {
        message: "Just saved your progress. Keep going!",
        icon: 'refresh-cw'
      }
    ],
    networkError: [
      {
        message: "Connection lost. Working offline - changes will sync when you're back. 🌐",
        action: "Retry",
        actionVariant: 'outline',
        icon: 'wifi-off'
      },
      {
        message: "You're offline. Changes will save when you reconnect. 📡",
        action: "Try again",
        actionVariant: 'outline',
        icon: 'cloud-off'
      }
    ],
    general: [
      {
        message: "Hmm, let's try that again. Third time's the charm! ✨",
        action: "Try again",
        actionVariant: 'default',
        icon: 'refresh-cw'
      },
      {
        message: "Oops! That didn't work as expected. 🤔",
        action: "Got it",
        actionVariant: 'outline',
        icon: 'alert-circle'
      }
    ]
  };

  const selectedMessages = messages[type] || messages.general;
  return selectedMessages[Math.floor(Math.random() * selectedMessages.length)];
};