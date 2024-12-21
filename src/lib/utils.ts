import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/clearCache.js
export function clearCacheForModel(modelName: string) {
  if (process.env.NODE_ENV === 'development') {
    try {
      const modelPath = require.resolve(`../models/${modelName}`);
      delete require.cache[modelPath]; // Clear the cache for the model
    } catch (err) {
      console.error(`Error clearing cache for model: ${modelName}`, err);
    }
  }
}


export const getDateAndTime = (timeString: Date) => {

  // Create a Date object
  const dateObject = new Date(timeString);

  // Extract date
  const date = dateObject.toLocaleDateString("en-US"); // Format: MM/DD/YYYY (default in en-US)

  // Extract time
  const time = dateObject.toLocaleTimeString("en-US"); // Format: HH:MM:SS AM/PM

  return `- ${time} on ${date}`
}