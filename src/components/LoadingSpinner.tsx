import { Spinner } from '@/components/ui/spinner';

export const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-10">
      <Spinner className="h-8 w-8 text-blue-500" />
    </div>
  );
};
