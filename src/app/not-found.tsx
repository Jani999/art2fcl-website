import Link from "next/link";
export default function NotFound() {
  return (
    <main className="error-page">
      <p>ERROR_404</p>
      <h1>
        REALITY
        <br />
        NOT FOUND.
      </h1>
      <Link href="/">RETURN TO SYSTEM ↗</Link>
    </main>
  );
}
