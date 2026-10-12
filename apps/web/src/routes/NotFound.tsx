import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-6 px-safe-x pt-48">
      <h1 className="text-title font-bold text-fg">Not found</h1>
      <Link
        to="/home"
        autoFocus
        className="focus-ring rounded-full bg-surface-raised px-6 py-3 text-body font-semibold text-fg tv-focus:focus-ring-on"
      >
        Back to home
      </Link>
    </div>
  );
}
