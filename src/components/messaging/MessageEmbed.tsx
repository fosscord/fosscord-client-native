// adapted from Revite
// https://github.com/revoltchat/revite/blob/master/src/components/common/messaging/embed/Embed.tsx

import { APIEmbed, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import classNames from "classnames";
import React from "react";
import { decimalColorToHex } from "../../utils/Utils";
import Markdown from "../markdown/Markdown";
import MarkdownRenderer from "../markdown/MarkdownRenderer";
import styles from "./Embed.module.css";
import EmbedMedia from "./EmbedMedia";
import { MessageAreaWidthContext } from "./MessageList";

const LINK_EMBED_MAX_WIDTH = 516;
const RICH_EMBED_MAX_WIDTH = 428;
const CONTAINER_PADDING = 24;
const EMBEDDABLE_PROVIDERS = ["Spotify" /*, "Bandcamp"*/];

interface Props {
	embed: APIEmbed;
}

function MessageEmbed({ embed }: Props) {
	const c = React.useContext(MessageAreaWidthContext);
	// const maxWidth = Math.min(c - MESSAGE_AREA_PADDING, MAX_EMBED_WIDTH);

	// function calculateSize(w: number, h: number): { width: number; height: number } {
	// 	const limitingWidth = Math.min(w, maxWidth);
	// 	const limitingHeight = Math.min(MAX_EMBED_HEIGHT, h);

	// 	// Calculate smallest possible WxH.
	// 	const width = Math.min(limitingWidth, limitingHeight * (w / h));

	// 	const height = Math.min(limitingHeight, limitingWidth * (h / w));

	// 	return { width, height };
	// }

	// Determine special embed size.
	let mw, mh;
	const largeMedia =
		embed.provider?.name === "GitHub" ||
		embed.provider?.name === "Streamable" ||
		embed.type === EmbedType.Video ||
		embed.type === EmbedType.GIFV ||
		embed.type === EmbedType.Image;

	// const { width, height } = calculateSize(mw, mh);
	if (
		embed.type === EmbedType.GIFV ||
		embed.type === EmbedType.Image ||
		(embed.type === EmbedType.Video && embed.provider?.name !== "YouTube") ||
		EMBEDDABLE_PROVIDERS.includes(embed.provider?.name ?? "")
	) {
		return <EmbedMedia embed={embed} />;
	}

	return (
		<div
			className={classNames(styles.embed, styles.website)}
			style={{
				borderInlineStartColor: embed.color ? decimalColorToHex(embed.color) : "var(--background-tertiary)",
				maxWidth: 432,
			}}
		>
			<div
				className={styles.embedGap}
				style={{
					maxWidth: embed.type === EmbedType.Rich ? RICH_EMBED_MAX_WIDTH : LINK_EMBED_MAX_WIDTH,
				}}
			>
				<div style={{ display: "flex" }}>
					<div className={styles.embedGap}>
						{embed.type !== EmbedType.Rich && embed.provider && (
							<span className={styles.embedProvider}>{embed.provider.name}</span>
						)}

						{embed.author && (
							<div className={styles.embedAuthor}>
								{embed.author.icon_url && (
									<img
										loading="lazy"
										className={styles.embedAuthorIcon}
										src={embed.author.icon_url}
										draggable={false}
										// onError={(e) => (e.currentTarget.style.display = "none")}
									/>
								)}
								{embed.author.url ? (
									<a
										href={embed.url}
										target={"_blank"}
										className={classNames(styles.embedAuthorName, styles.embedAuthorNameLink)}
									>
										{embed.author.name}
									</a>
								) : (
									<span className={styles.embedAuthorName}>{embed.author.name}</span>
								)}
							</div>
						)}

						{embed.title && (
							<>
								{embed.url ? (
									<a
										href={embed.url}
										target={"_blank"}
										className={classNames(styles.embedTitle, styles.embedTitleLink)}
									>
										{embed.title}
									</a>
								) : (
									<span className={styles.embedTitle}>{embed.title}</span>
								)}
							</>
						)}

						{embed.description && (
							<div className={styles.embedDescription}>
								<MarkdownRenderer content={embed.description} />
							</div>
						)}

						{embed.fields && (
							<div className={styles.embedFields}>
								{embed.fields.map((field, i) => (
									<div
										key={i}
										className={styles.embedField}
										style={{
											// inline = 1/7 for first, 7/14 for second
											// non-inline = 1/14
											gridColumn: field.inline ? (i % 2 === 0 ? "1 / 7" : "7 / 13") : "1 / 13",
										}}
									>
										<div className={styles.embedFieldName}>{field.name}</div>
										<div className={styles.embedFieldValue}>
											<Markdown content={field.value} />
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{(!largeMedia || embed.type === EmbedType.Rich) && embed.thumbnail && (
						<div>
							<EmbedMedia embed={embed} width={80} thumbnail />
						</div>
					)}
				</div>

				{(largeMedia || embed.type === EmbedType.Rich) && (
					<div>
						<EmbedMedia embed={embed} width={embed.provider?.name === "YouTube" ? 400 : undefined} />
					</div>
				)}

				{embed.footer && (
					<div className={styles.embedFooter}>
						{embed.footer.icon_url && (
							<img
								loading="lazy"
								className={styles.embedFooterIcon}
								src={embed.footer.icon_url}
								draggable={false}
								// onError={(e) => (e.currentTarget.style.display = "none")}
							/>
						)}
						<span className={styles.embedFooterText}>
							{embed.footer.text}
							{embed.timestamp && (
								<>
									<span className={styles.embedFooterSeperator}>•</span>
									{new Date(embed.timestamp).toLocaleString(undefined)}
								</>
							)}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

export default MessageEmbed;
