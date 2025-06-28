export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center text-white p-8">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page not found.</p>
      <a href="/" className="text-indigo-300 underline hover:text-indigo-500">
        Go back to home
      </a>
    </div>
  );
}