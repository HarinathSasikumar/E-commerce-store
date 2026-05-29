import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp,
  FiStar, FiRefreshCw, FiChevronLeft, FiChevronRight,
  FiPackage, FiSliders, FiArrowRight,
} from 'react-icons/fi';
import { getProducts } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import './ProductsPage.css';

/* ── Constants ───────────────────────────────────────────── */
const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Sports'];

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',   label: 'Top Rated' },
];

const PRICE_MAX = 2000;
const PER_PAGE  = 12;

/* ── Animation variants ──────────────────────────────────── */
const fadeUp = {
  initial:   { opacity: 0, y: 24 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

const collapseVariants = {
  open:   { height: 'auto', opacity: 1, overflow: 'visible' },
  closed: { height: 0,      opacity: 0, overflow: 'hidden'  },
};

/* ── FilterSection sub-component ─────────────────────────── */
function FilterSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section__header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="filter-section__title">{title}</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <motion.div
        variants={collapseVariants}
        animate={open ? 'open' : 'closed'}
        initial="open"
        transition={{ duration: 0.25 }}
        className="filter-section__body"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── Star Rating Picker ───────────────────────────────────── */
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-picker" role="group" aria-label="Minimum rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={`star-picker__star ${star <= (hovered || value) ? 'star-picker__star--active' : ''}`}
          onClick={() => onChange(star === value ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <FiStar />
        </button>
      ))}
      {value > 0 && (
        <span className="star-picker__label">{value}+ stars</span>
      )}
    </div>
  );
}

/* ── Price Range Inputs ───────────────────────────────────── */
function PriceRange({ min, max, onChange }) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  useEffect(() => { setLocalMin(min); setLocalMax(max); }, [min, max]);

  const commit = () => {
    const lo = Math.max(0, Math.min(Number(localMin), PRICE_MAX));
    const hi = Math.max(lo, Math.min(Number(localMax), PRICE_MAX));
    onChange(lo, hi);
  };

  return (
    <div className="price-range">
      {/* Track */}
      <div className="price-range__track-wrap">
        <div
          className="price-range__fill"
          style={{ left: `${(localMin / PRICE_MAX) * 100}%`, right: `${100 - (localMax / PRICE_MAX) * 100}%` }}
        />
        <input
          type="range" min={0} max={PRICE_MAX} step={10}
          value={localMin}
          className="price-range__slider price-range__slider--min"
          onChange={e => setLocalMin(Math.min(Number(e.target.value), localMax - 10))}
          onMouseUp={commit} onTouchEnd={commit}
          aria-label="Minimum price"
        />
        <input
          type="range" min={0} max={PRICE_MAX} step={10}
          value={localMax}
          className="price-range__slider price-range__slider--max"
          onChange={e => setLocalMax(Math.max(Number(e.target.value), localMin + 10))}
          onMouseUp={commit} onTouchEnd={commit}
          aria-label="Maximum price"
        />
      </div>

      {/* Inputs */}
      <div className="price-range__inputs">
        <div className="price-range__input-wrap">
          <span className="price-range__currency">$</span>
          <input
            type="number" min={0} max={PRICE_MAX}
            value={localMin}
            className="price-range__input"
            onChange={e => setLocalMin(e.target.value)}
            onBlur={commit}
            aria-label="Min price"
          />
        </div>
        <div className="price-range__sep" />
        <div className="price-range__input-wrap">
          <span className="price-range__currency">$</span>
          <input
            type="number" min={0} max={PRICE_MAX}
            value={localMax}
            className="price-range__input"
            onChange={e => setLocalMax(e.target.value)}
            onBlur={commit}
            aria-label="Max price"
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════════ */
export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── Read initial filters from URL ───────────────────────── */
  const readParam = (key, fallback) => searchParams.get(key) ?? fallback;

  const [category,  setCategory ] = useState(readParam('category', 'All'));
  const [priceMin,  setPriceMin ] = useState(Number(readParam('priceMin', 0)));
  const [priceMax,  setPriceMax ] = useState(Number(readParam('priceMax', PRICE_MAX)));
  const [sortBy,    setSortBy   ] = useState(readParam('sort', 'newest'));
  const [minRating, setMinRating] = useState(Number(readParam('rating', 0)));
  const [page,      setPage     ] = useState(Number(readParam('page', 1)));
  const [search,    setSearch   ] = useState(readParam('search', ''));
  const [searchInput, setSearchInput] = useState(readParam('search', ''));

  /* ── UI state ─────────────────────────────────────────────── */
  const [products,   setProducts  ] = useState([]);
  const [total,      setTotal     ] = useState(0);
  const [loading,    setLoading   ] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainRef = useRef(null);

  /* ── Sync URL when filters change ────────────────────────── */
  useEffect(() => {
    const p = {};
    if (category  !== 'All')      p.category = category;
    if (priceMin  > 0)            p.priceMin = priceMin;
    if (priceMax  < PRICE_MAX)    p.priceMax = priceMax;
    if (sortBy    !== 'newest')   p.sort     = sortBy;
    if (minRating > 0)            p.rating   = minRating;
    if (page      > 1)            p.page     = page;
    if (search)                   p.search   = search;
    setSearchParams(p, { replace: true });
  }, [category, priceMin, priceMax, sortBy, minRating, page, search]);

  /* ── Fetch products ──────────────────────────────────────── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: PER_PAGE,
        sort:  sortBy,
      };
      if (category  !== 'All') params.category  = category;
      if (priceMin  > 0)       params.priceMin   = priceMin;
      if (priceMax  < PRICE_MAX) params.priceMax = priceMax;
      if (minRating > 0)       params.minRating  = minRating;
      if (search)              params.search     = search;

      const res = await getProducts(params);
      // Support both { products, total } and flat array responses
      if (Array.isArray(res.data)) {
        setProducts(res.data);
        setTotal(res.data.length);
      } else {
        setProducts(res.data.products ?? res.data.data ?? []);
        setTotal(res.data.total ?? res.data.count ?? 0);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [category, priceMin, priceMax, sortBy, minRating, page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── Scroll to top of grid on page change ────────────────── */
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [page]);

  /* ── Helpers ──────────────────────────────────────────────── */
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const showingFrom = Math.min((page - 1) * PER_PAGE + 1, total);
  const showingTo   = Math.min(page * PER_PAGE, total);

  const handleCategoryChange = cat => { setCategory(cat); setPage(1); setMobileOpen(false); };
  const handleSortChange     = val => { setSortBy(val);   setPage(1); };
  const handlePriceChange    = (lo, hi) => { setPriceMin(lo); setPriceMax(hi); setPage(1); };
  const handleRatingChange   = val => { setMinRating(val); setPage(1); };

  const handleSearchSubmit = e => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const resetFilters = () => {
    setCategory('All'); setPriceMin(0); setPriceMax(PRICE_MAX);
    setSortBy('newest'); setMinRating(0); setPage(1); setSearch(''); setSearchInput('');
    setMobileOpen(false);
  };

  const hasActiveFilters =
    category !== 'All' || priceMin > 0 || priceMax < PRICE_MAX ||
    sortBy !== 'newest' || minRating > 0 || search !== '';

  /* ── Sidebar JSX (reused for both desktop + mobile) ──────── */
  const SidebarContent = (
    <div className="sidebar__inner">
      {/* Header */}
      <div className="sidebar__head">
        <div className="sidebar__head-left">
          <FiSliders className="sidebar__head-icon" />
          <span className="sidebar__head-title">Filters</span>
          {hasActiveFilters && (
            <span className="sidebar__active-dot" title="Filters active" />
          )}
        </div>
        {hasActiveFilters && (
          <button className="btn btn-sm sidebar__reset" onClick={resetFilters}>
            <FiRefreshCw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection title="Category">
        <div className="filter-category-list">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-category-btn ${category === cat ? 'filter-category-btn--active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              <span className="filter-category-btn__dot" />
              {cat}
            </button>
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" />

      {/* Price Range */}
      <FilterSection title="Price Range">
        <PriceRange min={priceMin} max={priceMax} onChange={handlePriceChange} />
      </FilterSection>

      <div className="filter-divider" />

      {/* Sort By */}
      <FilterSection title="Sort By">
        <div className="filter-sort-list">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`filter-sort-btn ${sortBy === opt.value ? 'filter-sort-btn--active' : ''}`}
              onClick={() => handleSortChange(opt.value)}
            >
              {opt.label}
              {sortBy === opt.value && <FiChevronRight className="filter-sort-btn__check" />}
            </button>
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" />

      {/* Min Rating */}
      <FilterSection title="Min Rating">
        <StarPicker value={minRating} onChange={handleRatingChange} />
      </FilterSection>
    </div>
  );

  /* ────────────────────────────────────────────────────────── */
  return (
    <div className="products-page page-enter">

      {/* ── Page Header ───────────────────────────────────────── */}
      <section className="products-hero">
        <div className="products-hero__orb products-hero__orb--1" />
        <div className="products-hero__orb products-hero__orb--2" />
        <div className="container">
          <motion.div className="products-hero__content" {...fadeUp}>
            <div className="section-eyebrow">Our Collection</div>
            <h1 className="products-hero__title display-serif">
              Discover{' '}
              <span className="text-gradient">Premium</span>{' '}
              Products
            </h1>
            <p className="products-hero__sub">
              Explore luxury, innovation, and timeless style — all in one destination.
            </p>

            {/* Search Bar */}
            <form className="products-hero__search" onSubmit={handleSearchSubmit} role="search">
              <div className="search-wrap glass">
                <FiSearch className="search-wrap__icon" />
                <input
                  type="search"
                  placeholder="Search products, brands, categories…"
                  className="search-wrap__input"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  aria-label="Search products"
                />
                {searchInput && (
                  <button type="button" className="search-wrap__clear"
                    onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }} aria-label="Clear search">
                    <FiX />
                  </button>
                )}
                <button type="submit" className="btn btn-primary btn-sm search-wrap__btn">
                  Search
                </button>
              </div>
            </form>

            {/* Active search badge */}
            <AnimatePresence>
              {search && (
                <motion.div
                  key="search-badge"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="search-active-badge"
                >
                  Results for: <strong>"{search}"</strong>
                  <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} aria-label="Clear search">
                    <FiX />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Main Layout ───────────────────────────────────────── */}
      <div className="container products-layout">

        {/* ── Desktop Sidebar ─────────────────────────────────── */}
        <aside className="products-sidebar glass" aria-label="Product filters">
          {SidebarContent}
        </aside>

        {/* ── Content Area ────────────────────────────────────── */}
        <main className="products-main" ref={mainRef}>

          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="products-toolbar__left">
              {/* Mobile filter toggle */}
              <button
                className="btn btn-outline btn-sm mobile-filter-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open filters"
              >
                <FiFilter /> Filters
                {hasActiveFilters && <span className="mobile-filter-badge" />}
              </button>

              {/* Results count */}
              {!loading && (
                <motion.p
                  key={`${showingFrom}-${total}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="results-count"
                >
                  {total === 0
                    ? 'No products found'
                    : `Showing ${showingFrom}–${showingTo} of ${total} product${total !== 1 ? 's' : ''}`}
                </motion.p>
              )}
            </div>

            {/* Active filter chips */}
            <div className="toolbar-chips">
              {category !== 'All' && (
                <button className="filter-chip" onClick={() => handleCategoryChange('All')}>
                  {category} <FiX />
                </button>
              )}
              {search && (
                <button className="filter-chip" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>
                  "{search}" <FiX />
                </button>
              )}
              {minRating > 0 && (
                <button className="filter-chip" onClick={() => setMinRating(0)}>
                  {minRating}+ ★ <FiX />
                </button>
              )}
              {(priceMin > 0 || priceMax < PRICE_MAX) && (
                <button className="filter-chip" onClick={() => handlePriceChange(0, PRICE_MAX)}>
                  ${priceMin}–${priceMax} <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ProductGridSkeleton count={PER_PAGE} />
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="products-empty"
              >
                <div className="products-empty__icon glass">
                  <FiPackage />
                </div>
                <h3 className="products-empty__title">No Products Found</h3>
                <p className="products-empty__sub">
                  Try adjusting your filters or{' '}
                  <button onClick={resetFilters} className="products-empty__link">
                    clear all filters
                  </button>
                  .
                </p>
                <Link to="/products" className="btn btn-primary btn-sm" onClick={resetFilters}>
                  Browse All Products <FiArrowRight />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={`page-${page}-${category}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="product-grid"
              >
                {products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.35 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!loading && products.length > 0 && totalPages > 1 && (
            <motion.div
              className="pagination"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                className="pagination__btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="Previous page"
              >
                <FiChevronLeft /> Previous
              </button>

              <div className="pagination__pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '…' ? (
                      <span key={`ellipsis-${idx}`} className="pagination__ellipsis">…</span>
                    ) : (
                      <button
                        key={item}
                        className={`pagination__page ${page === item ? 'pagination__page--active' : ''}`}
                        onClick={() => setPage(item)}
                        aria-label={`Page ${item}`}
                        aria-current={page === item ? 'page' : undefined}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <button
                className="pagination__btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="Next page"
              >
                Next <FiChevronRight />
              </button>
            </motion.div>
          )}
        </main>
      </div>

      {/* ── Mobile Filter Bottom Sheet ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="mobile-filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              className="mobile-filter-sheet glass-strong"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              aria-modal="true"
              role="dialog"
              aria-label="Product filters"
            >
              {/* Sheet handle */}
              <div className="mobile-filter-sheet__handle" />

              {/* Close */}
              <div className="mobile-filter-sheet__top">
                <span className="mobile-filter-sheet__heading">
                  <FiSliders /> Filters
                </span>
                <button
                  className="mobile-filter-sheet__close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                >
                  <FiX />
                </button>
              </div>

              <div className="mobile-filter-sheet__scroll">
                {SidebarContent}
              </div>

              <div className="mobile-filter-sheet__footer">
                <button className="btn btn-outline w-full" onClick={resetFilters}>
                  <FiRefreshCw /> Reset Filters
                </button>
                <button className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
                  Apply Filters
                  {total > 0 && <span className="mobile-filter-sheet__count">{total}</span>}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
