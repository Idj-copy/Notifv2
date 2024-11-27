import {Button} from './ui/button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <p className="text-red-400 mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Réessayer
        </Button>
      )}
    </div>
  );
}
