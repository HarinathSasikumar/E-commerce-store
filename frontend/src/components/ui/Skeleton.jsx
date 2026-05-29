import './Skeleton.css';

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-card__img" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__cat" />
        <div className="skeleton skeleton-card__title" />
        <div className="skeleton skeleton-card__title skeleton-card__title--short" />
        <div className="skeleton skeleton-card__rating" />
        <div className="skeleton skeleton-card__price" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="detail-skeleton container" style={{ paddingTop: '8rem' }}>
      <div className="detail-skeleton__grid">
        <div className="skeleton detail-skeleton__img" />
        <div className="detail-skeleton__info">
          <div className="skeleton detail-skeleton__line" style={{ width: '40%', height: '14px' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '80%', height: '32px', marginTop: '0.5rem' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '60%', height: '32px' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '30%', height: '20px', marginTop: '0.5rem' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '100%', height: '14px', marginTop: '1rem' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '90%', height: '14px' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '95%', height: '14px' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '80%', height: '14px' }} />
          <div className="skeleton detail-skeleton__line" style={{ width: '50%', height: '48px', marginTop: '2rem', borderRadius: '999px' }} />
        </div>
      </div>
    </div>
  );
}
