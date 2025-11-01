import TipCardSkeleton from './TipCardSkeleton';

interface TipGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3;
}

export default function TipGridSkeleton({ count = 6, columns = 3 }: TipGridSkeletonProps) {
  return (
    <div className={`grid gap-6 ${
      columns === 1 ? 'grid-cols-1' :
      columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {Array.from({ length: count }, (_, index) => (
        <TipCardSkeleton key={index} />
      ))}
    </div>
  );
}




