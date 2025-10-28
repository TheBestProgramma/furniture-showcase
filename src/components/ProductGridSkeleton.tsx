import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3;
}

export default function ProductGridSkeleton({ count = 6, columns = 3 }: ProductGridSkeletonProps) {
  return (
    <div className={`grid gap-6 ${
      columns === 1 ? 'grid-cols-1' :
      columns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
      'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }`}>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}



