import { type LucideProps } from "lucide-react"

export function Spinner(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export function Google(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21.8 10.7c.2 1.1.3 2.2.2 3.3 0 4.8-3.3 8.9-9 8.9A9 9 0 0 1 3 12a9 9 0 0 1 9-9c2.4 0 4.5.9 6 2.4l-2.4 2.4c-.6-.6-1.5-1-2.6-1-2.2 0-4 1.8-4 4s1.8 4 4 4c1.1 0 2.1-.4 2.8-1.1.8-.8 1.2-1.9 1-3.1H12v-3h9.8z" />
    </svg>
  )
}

export function GitHub(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.3-1.5 6.3-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.7s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.3 2.8 5 3.2 5 3.2a4.8 4.8 0 0 0-.1 3.7 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.1 6.4 6.3 6.7a3.4 3.4 0 0 0-.9 2.6V22" />
    </svg>
  )
}
