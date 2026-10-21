'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import siteMetadata from '../../site-metadata';
import { openCommandMenu } from '../command-menu';
import { ViewTransition } from '../view-transition';
import Breadcrumbs from './breadcrumbs';
import ThemeSwitch from './theme-switch/theme-switch';

export const navLinks = [
	{ href: '/blogs', title: 'Blogs' },
	{ href: '/projects', title: 'Projects' },
	{ href: '/uses', title: 'Uses' },
];

const MOBILE_QUERY = '(max-width: 639px)';

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden='true'
		>
			<circle cx='11' cy='11' r='7' />
			<path d='m20 20-3.5-3.5' />
		</svg>
	);
}

/**
 * Whether the nav should slide away: after scrolling down past the top, and
 * until the page is scrolled back up (even slightly) or reaches the top.
 */
function useHiddenOnScroll(enabled: boolean) {
	const [hidden, setHidden] = useState(false);
	useEffect(() => {
		setHidden(false);
		if (!enabled) return;
		let last = window.scrollY;
		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const y = window.scrollY;
				const delta = y - last;
				if (y < 64) setHidden(false);
				else if (delta > 4) setHidden(true);
				else if (delta < -4) setHidden(false);
				if (y < 64 || Math.abs(delta) > 4) last = y;
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', onScroll);
		};
	}, [enabled]);
	return hidden;
}

export default function SiteNav() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(MOBILE_QUERY);
		const update = () => {
			setIsMobile(media.matches);
			if (!media.matches) setOpen(false);
		};
		update();
		media.addEventListener('change', update);
		return () => media.removeEventListener('change', update);
	}, []);

	// Close the mobile menu on navigation and on Escape.
	// biome-ignore lint/correctness/useExhaustiveDependencies: runs on route change
	useEffect(() => setOpen(false), [pathname]);
	useEffect(() => {
		if (!open) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [open]);

	// The home story pins its frame under the nav, so there it always stays.
	const hidden = useHiddenOnScroll(pathname !== '/' && !open);

	return (
		<header
			className={classNames(
				'sticky top-0 z-20 w-full border-b border-(--ds-border) bg-[color-mix(in_oklch,var(--ds-bg-secondary)_85%,transparent)] backdrop-blur-md motion-safe:transition-transform motion-safe:duration-300 has-[:focus-visible]:translate-y-0',
				hidden && '-translate-y-full',
			)}
		>
			{/*
				The links are rendered once (the active indicator is a named view
				transition and must be unique): inline on desktop, inside the
				collapsible hamburger panel on mobile.
			*/}
			<nav className='mx-auto flex w-full max-w-5xl flex-wrap items-center border-x border-gray-200 px-5 dark:border-gray-300/20 sm:h-16 sm:flex-nowrap sm:px-8 md:px-18'>
				{/* Terminal-style brand: the current path as breadcrumbs, e.g. ~/utc / blogs */}
				<Breadcrumbs />

				{/* Mobile: hamburger toggle */}
				<button
					type='button'
					onClick={() => setOpen((value) => !value)}
					aria-expanded={open}
					aria-controls='site-nav-menu'
					aria-label={open ? 'Close menu' : 'Open menu'}
					className='order-2 -mr-2 ml-auto flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5 sm:hidden'
				>
					<span
						className={classNames(
							'h-0.5 w-5 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-300',
							open && 'translate-y-2 rotate-45',
						)}
					/>
					<span
						className={classNames(
							'h-0.5 w-5 rounded-full bg-current motion-safe:transition-opacity motion-safe:duration-200',
							open && 'opacity-0',
						)}
					/>
					<span
						className={classNames(
							'h-0.5 w-5 rounded-full bg-current motion-safe:transition-transform motion-safe:duration-300',
							open && '-translate-y-2 -rotate-45',
						)}
					/>
				</button>

				{/* Links: collapsible panel on mobile, inline row on desktop */}
				<div
					id='site-nav-menu'
					inert={isMobile && !open ? true : undefined}
					className={classNames(
						'order-3 grid w-full motion-safe:transition-[grid-template-rows] motion-safe:duration-300 sm:order-2 sm:mr-4 sm:ml-auto sm:flex sm:w-auto',
						open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
					)}
				>
					<div className='min-h-0 overflow-hidden sm:overflow-visible'>
						<div className='flex flex-col items-start gap-1 pt-1 pb-4 text-sm font-semibold sm:flex-row sm:items-center sm:gap-0 sm:p-0'>
							{navLinks.map(({ href, title }, index) => {
								const isActive =
									pathname === href || pathname.startsWith(`${href}/`);
								return (
									<Fragment key={href}>
										{index > 0 && (
											<span
												aria-hidden='true'
												className='hidden px-1 font-mono font-normal text-(--ds-text-tertiary) select-none sm:inline'
											>
												|
											</span>
										)}
										<Link
											href={href}
											aria-current={isActive ? 'page' : undefined}
											className={classNames(
												'relative py-2 motion-safe:transition-colors motion-safe:duration-150 sm:px-2 sm:py-1',
												isActive
													? 'text-primary-500'
													: 'text-(--ds-text-primary) hover:text-primary-500',
											)}
										>
											{title}
											{isActive && (
												// Named view transition: on navigation the browser morphs
												// this bar from the previous link to the new one.
												<ViewTransition
													name='nav-indicator'
													share='nav-indicator'
													default='none'
												>
													<span
														className='absolute inset-x-0 bottom-1 h-px bg-primary-500 sm:inset-x-2 sm:bottom-0'
														data-vt='nav-indicator'
													/>
												</ViewTransition>
											)}
										</Link>
									</Fragment>
								);
							})}
							<span
								aria-hidden='true'
								className='hidden px-1 font-mono font-normal text-(--ds-text-tertiary) select-none sm:inline'
							>
								|
							</span>
							<a
								href={siteMetadata.resume}
								target='_blank'
								rel='noreferrer'
								className='py-2 text-(--ds-text-primary) hover:text-primary-500 motion-safe:transition-colors motion-safe:duration-150 sm:px-2 sm:py-1'
							>
								Resume ↗
							</a>

							{/* Mobile-only: search and theme inside the menu */}
							<div className='mt-2 flex w-full items-center justify-between border-t border-dashed border-(--ds-border-strong) pt-3 sm:hidden'>
								<button
									type='button'
									onClick={() => {
										setOpen(false);
										openCommandMenu();
									}}
									className='-ml-1 flex cursor-pointer items-center gap-2 py-2 text-(--ds-text-secondary) hover:text-primary-500'
								>
									<SearchIcon className='h-5 w-5' />
									Search
								</button>
								<ThemeSwitch className='-mr-2 flex items-center' />
							</div>
						</div>
					</div>
				</div>

				{/* Desktop: ⌘K and theme */}
				<div className='order-3 hidden items-center gap-1 sm:flex'>
					<button
						type='button'
						onClick={openCommandMenu}
						aria-label='Open command menu'
						className='cursor-pointer rounded-(--ds-radius) border border-(--ds-border-strong) px-2 py-0.5 font-mono text-xs text-(--ds-text-secondary) hover:border-primary-500 hover:text-primary-500'
					>
						<kbd className='font-mono'>⌘K</kbd>
					</button>
					<ThemeSwitch className='-mr-2 flex items-center' />
				</div>
			</nav>
		</header>
	);
}
