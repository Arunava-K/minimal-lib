
import { useLayoutEffect, useEffect } from 'react';

// Use useLayoutEffect on client side, and useEffect during SSR
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
