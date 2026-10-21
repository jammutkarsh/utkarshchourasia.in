// vinext swaps the `react` import of any module using ViewTransition for a
// shim that, in dev, loses React's other exports (hooks included), so it is
// imported from here rather than next to them.
export { ViewTransition } from 'react';
