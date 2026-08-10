import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  let bg = 'bg-gray-100';
  let text = 'text-gray-800';

  switch (status.toLowerCase()) {
    case 'valid':
    case 'active':
      bg = 'bg-green-100';
      text = 'text-green-800';
      break;
    case 'revoked':
      bg = 'bg-orange-100';
      text = 'text-orange-800';
      break;
    case 'invalid':
      bg = 'bg-red-100';
      text = 'text-red-800';
      break;
    case 'expired':
      bg = 'bg-gray-100';
      text = 'text-gray-600';
      break;
  }

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', bg, text)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
