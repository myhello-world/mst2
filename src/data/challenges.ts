import { Challenge } from '../types';

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Basic Reflection",
    description: "The application reflects your input without any filtering. Find a way to execute JavaScript code.",
    hint: "",
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 2,
    title: "Uppercase vs Lowercase Filter",
    description: "Only lowercase script patterns are blocked. Exploit uppercase/lowercase differences to bypass the filter.",
    hint: "Try using different case variations of script tags",
    completed: false,
    difficulty: 'easy'
  },
  {
    id: 3,
    title: "Mixed-Case Tag Injection",
    description: "The filter removes <script> but ignores <ScRiPt>. Use case manipulation to run JS inside the page.",
    hint: "Try different case variations of script tags",
    completed: false,
    difficulty: 'medium'
  },
  {
    id: 4,
    title: "HTML Entity Encoding",
    description: "The application encodes certain characters. Find a way to bypass the encoding to execute JavaScript.",
    hint: "",
    completed: false,
    difficulty: 'medium'
  },
  {
    id: 5,
    title: "Image onError XSS",
    description: "The application allows you to insert an <img> tag. The image URL is invalid, so the onerror event runs. Use this to execute JavaScript.",
    hint: "Create an image tag with an invalid src and an onerror handler",
    completed: false,
    difficulty: 'hard'
  }
];