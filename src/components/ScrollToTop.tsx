import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — scrolls window to top on pathname changes when there is
 * no hash present. This preserves hash navigation behavior (e.g. /#my-work)
 * while ensuring route changes (e.g. /about) reset scroll position.
 */
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only auto-scroll when there's no hash (HashLink handles hash scrolling)
    if (hash && hash.length > 0) return;

    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    } catch {
      // fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
