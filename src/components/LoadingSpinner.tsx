

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      <p className="mt-4 text-gray-400">Chargement des événements...</p>
    </div>
  );
}
