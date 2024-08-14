import { useState, useEffect } from 'react';

const useIsSearchable = () => {
  const [isSearchable, setIsSearchable] = useState(true);

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 449) {
        setIsSearchable(false);
      } else {
        setIsSearchable(true);
      }
    };

    window.addEventListener('resize', checkWidth);

    checkWidth();

    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  return isSearchable;
};

export default useIsSearchable;
