export type ICampaign = {
	id: string;
	title: string;
	image_url: string;
	created_at: string;
	is_premium: boolean;
	content: string;
	is_published: boolean;
	addresses: any;
	target_usd: number;
	user_id: string;
};

export type ICampaignDetial = {
	created_at: string;
	id: string;
	image_url: string;
	is_premium: boolean;
	is_published: boolean;
	title: string;
	campaign_content: {
		campaign_id: string;
		content: string;
		created_at: string;
	};
	addresses: any;
	target_usd: number;
	user_id: string;
} | null;

export type ICampaignForm = {
	created_at: string;
	id: string;
	image_url: string;
	is_premium: boolean;
	is_published: boolean;
	title: string;
	campaign_content: {
		campaign_id: string;
		content: string;
		created_at: string;
	};
};

export type Iuser = {
	created_at: string;
	display_name: string;
	email: string;
	id: string;
	image_url: string;
	role: string;
	stripe_customer_id: string | null;
	stripe_subscription_id: string | null;
	subscription_status: boolean;
} | null;
