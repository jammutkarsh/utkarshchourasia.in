import { flushSync } from 'react-dom';

/**
 * Switches the theme with a circular reveal that grows from `origin`
 * (e.g. the clicked button). Falls back to an instant switch when the View
 * Transitions API is unavailable or the user prefers reduced motion.
 */
export function switchTheme(
	apply: () => void,
	origin?: { x: number; y: number },
) {
	const reduceMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;
	if (!('startViewTransition' in document) || reduceMotion) {
		apply();
		return;
	}

	const x = origin?.x ?? window.innerWidth / 2;
	const y = origin?.y ?? window.innerHeight / 2;
	const radius = Math.hypot(
		Math.max(x, window.innerWidth - x),
		Math.max(y, window.innerHeight - y),
	);

	const root = document.documentElement;
	root.classList.add('theme-switching');
	const transition = document.startViewTransition(() => {
		flushSync(apply);
	});

	// A view transition started before this one is ready (a second toggle, or
	// a page navigation) skips it and rejects `ready` with an AbortError. The
	// theme is still applied, only the reveal is dropped, so ignore that.
	transition.ready.then(
		() => {
			root.animate(
				{
					clipPath: [
						`circle(0px at ${x}px ${y}px)`,
						`circle(${radius}px at ${x}px ${y}px)`,
					],
				},
				{
					duration: 500,
					easing: 'ease-out',
					pseudoElement: '::view-transition-new(root)',
				},
			);
		},
		() => {},
	);
	transition.finished.finally(() => root.classList.remove('theme-switching'));
}
