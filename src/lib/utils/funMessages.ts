interface FunMessage {
  message: string;
  description?: string;
  action?: string;
  actionVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  icon?: string;
}

type MessageCategory = {
  [key: string]: FunMessage[];
};

type FunMessages = {
  [key: string]: MessageCategory | FunMessage[];
};

const funMessages: FunMessages = {
  noImage: [
    {
      message: "This template is camera shy! It's all about the words. ",
      action: "Got it, let's write!",
      actionVariant: 'default',
      icon: 'text'
    },
    {
      message: "No image spot here - it's a text-only zone!",
      action: "Focus on text ",
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
      message: "Text is the new black! This template is strictly typography. ",
      action: "Let's type!",
      actionVariant: 'default',
      icon: 'keyboard'
    }
  ],
  noTemplate: [
    {
      message: "Hold up! You're trying to run before we've built the track. ",
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
      message: "Step 1: Template. Step 2: Quote. You're on step 2. ",
      action: "Back to step 1",
      actionVariant: 'outline',
      icon: 'arrow-left'
    },
    {
      message: "Template first, then quote. It's the circle of life! ",
      action: "Pick template",
      actionVariant: 'default',
      icon: 'file-edit'
    },
    {
      message: "Whoops! You've jumped straight to the middle of the story. ",
      action: "Start from the beginning",
      actionVariant: 'default',
      icon: 'rewind'
    }
  ],
  maxText: [
    {
      message: "Whoa there, Shakespeare! One text box to rule them all. ",
      action: "Edit text",
      actionVariant: 'outline',
      icon: 'edit'
    },
    {
      message: "Text limit reached! Your words are powerful, but let's keep it concise. ",
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
      message: "All changes saved! Your masterpiece is safe with us. ",
      icon: 'check-circle'
    },
    {
      message: "Auto-saved! Your creativity is preserved. ",
      icon: 'save'
    },
    {
      message: "Progress saved! Keep creating. ",
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
      message: "Connection lost. Working offline - changes will sync when you're back. ",
      action: "Retry",
      actionVariant: 'outline',
      icon: 'wifi-off'
    },
    {
      message: "You're offline. Changes will save when you reconnect. ",
      action: "Try again",
      actionVariant: 'outline',
      icon: 'cloud-off'
    }
  ],
  general: [
    {
      message: "Ready to create something amazing?",
      action: "Let's go!",
      actionVariant: 'default',
      icon: 'zap'
    },
    {
      message: "Hmm, let's try that again. Third time's the charm! ",
      action: "Try again",
      actionVariant: 'default',
      icon: 'refresh-cw'
    },
    {
      message: "Oops! That didn't work as expected. ",
      action: "Got it",
      actionVariant: 'outline',
      icon: 'alert-circle'
    }
  ],
  feedback: {
    success: [
      {
        message: "Feedback received! 🚀",
        description: "Our team just did a happy dance while reading your feedback!",
        icon: "rocket"
      },
      {
        message: "You're awesome! ✨",
        description: "Your feedback just made our day a whole lot better!",
        icon: "sparkles"
      },
      {
        message: "High five! 🙌",
        description: "Your feedback is on its way to making our product even better!",
        icon: "hand"
      },
      {
        message: "Boom! Feedback delivered! 💥",
        description: "Your thoughts are now in our system and ready to create some magic!",
        icon: "zap"
      },
      {
        message: "You're a rockstar! 🌟",
        description: "Thanks for taking the time to help us improve!",
        icon: "star"
      }
    ],
    error: [
      {
        message: "Whoopsie daisy! 🌼",
        description: "Something went wrong while saving your feedback. Mind giving it another shot?",
        action: "Try again",
        actionVariant: "outline"
      },
      {
        message: "Well, this is awkward... 😅",
        description: "We couldn't save your feedback. Maybe the internet gremlins are at it again?",
        action: "Try again",
        actionVariant: "outline"
      },
      {
        message: "Houston, we have a problem! 🚀",
        description: "Our servers are being shy. Let's try that again, shall we?",
        action: "Retry",
        actionVariant: "outline"
      }
    ]
  },
  waitlist: {
    success: [
      { 
        message: "You're officially on the list! ", 
        description: "Get ready for exclusive early access to premium features.",
        icon: ""
      },
      { 
        message: "Welcome to the VIP waitlist! ", 
        description: "You'll be the first to know when we launch our pro features.",
        icon: ""
      },
      { 
        message: "Success! You're in the club! ", 
        description: "Early access and special offers are coming your way soon.",
        icon: ""
      },
      { 
        message: "High five! ", 
        description: "You're now on the waitlist for early access to game-changing features.",
        icon: ""
      }
    ],
    alreadyExists: [
      { 
        message: "You're already on the list! ", 
        description: "No need to sign up again - we've got you covered!",
        icon: ""
      },
      { 
        message: "Welcome back, early adopter! ", 
        description: "You're already on our waitlist with priority access.",
        icon: ""
      },
      { 
        message: "No need to sign up again! ", 
        description: "Your spot on the waitlist is secure.",
        icon: ""
      }
    ],
    error: [
      { 
        message: "Oops! Something went wrong. ", 
        description: "Please try again in a moment while we fix this.",
        icon: ""
      },
      { 
        message: "Hold on! ", 
        description: "We're having trouble adding you to the waitlist. Please try again.",
        icon: ""
      },
      { 
        message: "Technical difficulties! ", 
        description: "We couldn't add you to the waitlist right now. Please try again later.",
        icon: ""
      }
    ],
    invalidEmail: [
      {
        message: "Invalid Email ",
        description: "Please enter a valid email address to join the waitlist.",
        icon: "✉️"
      },
      {
        message: "Email Required ",
        description: "Please enter your email address to join the waitlist.",
        icon: "📧"
      },
      {
        message: "Almost There! ",
        description: "That doesn't look like a valid email. Please check and try again.",
        icon: "🔍"
      }
    ],
  }
};

export function getRandomMessage(type: string, subType?: string): FunMessage {
  try {
    // If a subtype is provided (e.g., 'waitlist.success'), handle it
    const typeParts = type.split('.');
    let messages: FunMessage[] = [];
    let category: MessageCategory | undefined;

    if (typeParts.length > 1) {
      // Handle nested types like 'waitlist.success'
      const [mainType, subType] = typeParts;
      category = funMessages[mainType] as MessageCategory | undefined;
      if (category && subType in category) {
        messages = category[subType] || [];
      }
    } else if (subType) {
      // Handle separate type and subtype parameters
      const mainCategory = funMessages[type];
      if (mainCategory && !Array.isArray(mainCategory) && subType in mainCategory) {
        messages = mainCategory[subType] || [];
      }
    } else if (Array.isArray(funMessages[type])) {
      // Handle direct array access
      messages = funMessages[type] as FunMessage[];
    }

    // If we have messages, return a random one
    if (messages.length > 0) {
      return messages[Math.floor(Math.random() * messages.length)];
    }

    // Fallback if no messages found
    return { 
      message: 'Welcome!', 
      description: 'Thank you for your interest!',
      icon: '✨'
    };
  } catch (error) {
    console.error('Error getting random message:', error);
    return { 
      message: 'Welcome!', 
      description: 'Thank you for your interest!',
      icon: '✨'
    };
  }
}