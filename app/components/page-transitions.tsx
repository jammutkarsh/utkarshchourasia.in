'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Animates client-side navigations with the View Transitions API.
 *
 * TODO: temporary. The layout's <ViewTransition> boundaries should do this,
 * but vinext's router doesn't trigger React view transitions yet
 * (https://github.com/cloudflare/vinext/issues/2603). Once it does, delete
 * this component, its use in app/layout.tsx, the `data-vt` attributes and
 * the `html.page-navigating` rules in app/site.css.
 */
export default function PageTransitions() {
	const router = useRouter();
	const pathname = usePathname();
	const arrived = useRef<() => void>(undefined);

	// The new page has rendered once the pathname changes.
	// biome-ignore lint/correctness/useExhaustiveDependencies: runs on every navigation
	useEffect(() => {
		arrived.current?.();
		arrived.current = undefined;
	}, [pathname]);

	useEffect(() => {
		function onClick(event: MouseEvent) {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey ||
				!document.startViewTransition ||
				window.matchMedia('(prefers-reduced-motion: reduce)').matches
			) {
				return;
			}
			const link = (event.target as Element).closest('a');
			if (
				!link ||
				(link.target && link.target !== '_self') ||
				link.hasAttribute('download')
			) {
				return;
			}
			const url = new URL(link.href);
			if (
				url.origin !== window.location.origin ||
				url.pathname === window.location.pathname
			) {
				return;
			}

			// Navigate inside the transition instead of letting <Link> do it, so
			// the old page is captured before it changes.
			event.preventDefault();
			event.stopPropagation();
			const root = document.documentElement;
			root.classList.add('page-navigating');
			const transition = document.startViewTransition(
				() =>
					new Promise<void>((resolve) => {
						arrived.current = resolve;
						router.push(url.pathname + url.search + url.hash);
						// Don't freeze the page if the navigation stalls.
						setTimeout(resolve, 3000);
					}),
			);
			transition.finished.finally(() =>
				root.classList.remove('page-navigating'),
			);
		}

		// Capture on window runs before <Link>'s own click handler.
		window.addEventListener('click', onClick, true);
		return () => window.removeEventListener('click', onClick, true);
	}, [router]);

	return null;
}
