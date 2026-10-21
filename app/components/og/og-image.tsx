import { ImageResponse } from 'next/og';
// Inlined at build time: a Worker has no filesystem to read them from.
import interLightUrl from '../../../assets/fonts/Inter-300.ttf?inline';
import monoRegularUrl from '../../../assets/fonts/JetBrainsMono-400.ttf?inline';
// A small copy of public/images/avatar.png; the original is too large to embed.
import avatarSrc from '../../../public/images/avatar-og.jpg?inline';
import siteMetadata from '../../site-metadata';
import { terminalPath } from '../layouts/terminal-path';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

// utc-ds dark theme tokens (app/utc-ds.css).
const colors = {
	background: '#0a0a0a',
	border: '#333333',
	text: '#e8e8e8',
	muted: '#888888',
	primary: '#ff5f00',
};

interface OgImageOptions {
	/** The page's URL path, shown as a terminal path (~/utc/...) in the top bar. */
	path: string;
	title: string;
	description?: string;
	/** Right-aligned footer text, e.g. "May 5, 2025 · 7 min read". */
	meta?: string;
	/**
	 * Home page: the avatar sits beside the title and description, like the
	 * site's intro, instead of in the footer.
	 */
	profile?: boolean;
	/**
	 * A picture filling the body instead of the title and description, e.g. a
	 * project's architecture diagram or hero (the path already names the
	 * page). `src` is a PNG or JPEG data URI.
	 */
	picture?: { src: string; fit: 'contain' | 'cover' };
}

/** The bytes of a base64 data URI. */
function dataUriBytes(uri: string) {
	return Buffer.from(uri.slice(uri.indexOf(',') + 1), 'base64');
}
const interLight = dataUriBytes(interLightUrl);
const monoRegular = dataUriBytes(monoRegularUrl);

/** Shortens text to `max` characters, cutting at a word boundary. */
function truncate(text: string, max: number) {
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	const space = cut.lastIndexOf(' ');
	return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,.;:–—-]+$/, '')}…`;
}

/** Renders a 1200×630 Open Graph image in the site's (utc-ds) style. */
export async function renderOgImage({
	path: pagePath,
	title,
	description,
	meta,
	profile = false,
	picture,
}: OgImageOptions) {
	const titleSize = title.length > 70 ? 48 : title.length > 40 ? 58 : 68;
	const terminal = truncate(terminalPath(pagePath), 60);

	const text = (
		<div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
			<span
				style={{
					fontSize: titleSize,
					lineHeight: 1.2,
					letterSpacing: -2,
				}}
			>
				{truncate(title, 110)}
			</span>
			<div
				style={{
					width: 120,
					height: 4,
					marginTop: 24,
					backgroundColor: colors.primary,
				}}
			/>
			{description && (
				<span
					style={{
						marginTop: 24,
						fontSize: 30,
						lineHeight: 1.4,
						color: colors.muted,
					}}
				>
					{truncate(description, 140)}
				</span>
			)}
		</div>
	);

	return new ImageResponse(
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				padding: '0 80px',
				backgroundColor: colors.background,
				color: colors.text,
				fontFamily: 'Inter',
				fontWeight: 300,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					height: '100%',
					borderLeft: `1px solid ${colors.border}`,
					borderRight: `1px solid ${colors.border}`,
				}}
			>
				{/* Top bar, like the site navbar: the page's terminal path */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						height: 88,
						padding: '0 56px',
						borderBottom: `1px solid ${colors.border}`,
						fontFamily: 'JetBrains Mono',
						fontSize: 26,
					}}
				>
					<span style={{ color: colors.primary }}>~/</span>
					<span>{terminal.slice(2)}</span>
				</div>

				{/* Picture layout: the picture filling the body, the description under it */}
				{picture && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							flex: 1,
							padding: '36px 56px 28px',
						}}
					>
						<div
							style={{
								display: 'flex',
								flex: 1,
								borderRadius: 8,
								border: `1px solid ${colors.border}`,
								overflow: 'hidden',
								backgroundColor: '#111111',
							}}
						>
							{/* biome-ignore lint/performance/noImgElement: next/og renders plain img */}
							<img
								src={picture.src}
								alt=''
								width={926}
								height={300}
								style={{
									width: '100%',
									height: '100%',
									objectFit: picture.fit,
									// Diagrams are centred; cropped screenshots keep their top.
									objectPosition: picture.fit === 'cover' ? 'top' : 'center',
								}}
							/>
						</div>
						{description && (
							<span
								style={{
									marginTop: 20,
									fontSize: 26,
									lineHeight: 1.35,
									color: colors.muted,
								}}
							>
								{truncate(description, 120)}
							</span>
						)}
					</div>
				)}

				{/* Body */}
				{!picture && (
					<div
						style={{
							display: 'flex',
							flex: 1,
							alignItems: profile ? 'center' : 'flex-start',
							gap: 56,
							padding: profile ? '0 56px' : '56px 56px 0',
						}}
					>
						{text}
						{profile && (
							// biome-ignore lint/performance/noImgElement: next/og renders plain img
							<img
								src={avatarSrc}
								alt=''
								width={280}
								height={280}
								style={{ borderRadius: 8, objectFit: 'cover' }}
							/>
						)}
					</div>
				)}

				{/* Footer: avatar and handle, plus e.g. a post's date */}
				{!profile && (
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 32,
							padding: '0 56px 44px',
							fontFamily: 'JetBrains Mono',
						}}
					>
						<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
							{/* biome-ignore lint/performance/noImgElement: next/og renders plain img */}
							<img
								src={avatarSrc}
								alt=''
								width={56}
								height={56}
								style={{
									borderRadius: 9999,
									border: `2px solid ${colors.primary}`,
									objectFit: 'cover',
								}}
							/>
							<span style={{ fontSize: 22 }}>{siteMetadata.headerTitle}</span>
						</div>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 14,
								fontSize: 16,
								color: colors.muted,
							}}
						>
							{meta && <span>{meta}</span>}
						</div>
					</div>
				)}
			</div>
		</div>,
		{
			...ogSize,
			fonts: [
				{ name: 'Inter', data: interLight, weight: 300 },
				{ name: 'JetBrains Mono', data: monoRegular, weight: 400 },
			],
		},
	);
}
