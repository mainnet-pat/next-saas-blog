import * as z from "zod";

export const SupportedChains = [
	"arbitrum-one",
	"avalanche",
	"bitcoin-cash",
	"bitcoin",
	"bnb",
	"cardano",
	"dogecoin",
	"ethereum",
	"litecoin",
	"polygon",
	"solana",
	"ton",
	"tron",
];

export const BlogFormSchema = z
	.object({
		title: z.string().min(10, {
			message: "title is too short",
		}),
		content: z.string().min(50, {
			message: "Content is too short",
		}),
		image_url: z.string().url({
			message: "Invalid url",
		}),
		is_premium: z.boolean(),
		is_published: z.boolean(),
		user_id: z.string(),
		target_usd: z.coerce.number().gt(0, {
			message: "Target USD must be greater than 0",
		}),
		addresses: z.object({}),
		// "addresses_arbitrum-one": z.string().optional(),
		// "addresses_avalanche": z.string().optional(),
		// "addresses_bitcoin-cash": z.string().optional(),
		// "addresses_bitcoin": z.string().optional(),
		// "addresses_bnb": z.string().optional(),
		// "addresses_cardano": z.string().optional(),
		// "addresses_dogecoin": z.string().optional(),
		// "addresses_ethereum": z.string().optional(),
		// "addresses_litecoin": z.string().optional(),
		// "addresses_polygon": z.string().optional(),
		// "addresses_solana": z.string().optional(),
		// "addresses_ton": z.string().optional(),
		// "addresses_tron": z.string().optional(),
		...SupportedChains.reduce((acc: any, chain: string) => {
			acc[`addresses_${chain}`] = z.string().optional();
			return acc;
		}, {}),
	})
	.refine(
		(data) => {
			const image_url = data.image_url;
			try {
				const url = new URL(image_url);
				return url.hostname === "images.unsplash.com";
			} catch {
				return false;
			}
		},
		{
			message: "Currently we are supporting only the image from unsplash",
			path: ["image_url"],
		}
	);

export type BlogFormSchemaType = z.infer<typeof BlogFormSchema>;
