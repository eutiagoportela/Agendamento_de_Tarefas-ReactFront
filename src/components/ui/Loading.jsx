import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Carregando...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 space-y-3">
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loading;