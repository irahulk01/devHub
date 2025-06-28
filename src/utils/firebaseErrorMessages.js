const firebaseErrorMessages = {
  // Common Auth Errors
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Invalid login credentials.",
  "auth/too-many-requests": "Too many login attempts. Try again later.",
  "auth/network-request-failed": "Network error. Please check your connection.",

  // Register-specific
  "auth/email-already-in-use": "This email is already registered.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",

  // Google popup errors
  "auth/popup-blocked": "Google popup was blocked by the browser.",
  "auth/popup-closed-by-user": "Google sign-in popup was closed.",
  "auth/cancelled-popup-request": "Cancelled previous popup request.",
};

export const getFirebaseErrorMessage = (code = "") => {
  return firebaseErrorMessages[code] || "Something went wrong. Please try again.";
};