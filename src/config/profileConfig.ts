import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "../utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	avatar: "assets/images/avatar.jpeg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "banglee",
	bio: "菜逼。",
	links: [
		/*
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
			// You will need to install the corresponding icon set if it's not already included
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://twitter.com",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com",
		},
		*/
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/banglee13",
		},
		{
			name: "洛谷",
			icon: "simple-icons:luogu",
			url: "https://www.luogu.com.cn/user/681292",
		},
		{
			name: "bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/3493286188681550",
		},
		{
			name: "QQ",
			icon: "fa6-brands:qq",
			url: "2477108125",
		},
	],
});
