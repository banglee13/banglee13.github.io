import type { AnimeItem } from "../data/anime.ts";

/**
 * 支持的番剧外部数据服务提供方
 */
export type AnimeProvider = "bangumi" | "bilibili";

/**
 * 番剧页面消费的主数据源类型：
 * - `"local"`：使用 `src/data/anime.ts` 本地手写数据（默认，零外部依赖，稳定可控）；
 * - `"snapshot"`：读取由同步命令生成的本地脱敏 JSON 快照（`src/data/anime-snapshots/`）。
 */
export type AnimeSourceKind = "local" | "snapshot";

/**
 * 快照不可用或缺失时的降级回退策略：
 * - `"local"`：静默回退至 `src/data/anime.ts` 本地手写数据（默认，保障页面不白屏）；
 * - `"empty"`：显示友好空状态，不渲染任何番剧卡片。
 */
export type AnimeFallbackKind = "local" | "empty";

/**
 * 封面资源策略：
 * - `"local"`：由同步脚本下载封面至站内 `public/assets/anime/covers/`，页面零第三方 CDN 外链请求（推荐）；
 * - `"remote"`：页面加载清洗后的 HTTPS 封面图片；
 * - `"none"`：不使用封面，卡片呈现主题渐变占位。
 */
export type AnimeCoverMode = "local" | "remote" | "none";

/**
 * 数据源配置契约
 */
export interface AnimeSourceConfig {
	/** 数据源类别 */
	kind: AnimeSourceKind;
	/** 指定 provider（当 kind 为 "snapshot" 时建议指定） */
	provider?: AnimeProvider;
	/** 指定快照文件名（必须限定在快照目录内，如 "bangumi.json" 或 "bilibili.json"） */
	file?: string;
	/** 是否在开发环境 (pnpm dev) 下允许热重载并读取最新快照数据（默认 true） */
	fetchOnDev?: boolean;
}

/**
 * 降级配置契约
 */
export interface AnimeFallbackConfig {
	/** 降级策略 */
	kind: AnimeFallbackKind;
}

/**
 * 通用网络请求调优选项
 */
export interface AnimeRequestOptions {
	/** 单页拉取大小（默认由各 provider 适配器安全上限约束） */
	pageSize?: number;
	/** 最大拉取条目数上限（防止过度抓取，默认 300） */
	maxItems?: number;
	/** 请求节流延迟毫秒数（防止触发 API 限流，默认 300ms） */
	minDelayMs?: number;
}

/**
 * Bangumi 提供方配置
 */
export interface BangumiProviderConfig {
	/** 是否启用 Bangumi 同步能力 */
	enable: boolean;
	/** Bangumi 用户 ID 或公开个性域名（必填，未填时自动禁用） */
	userId: string;
	/** 可选网络请求参数 */
	request?: AnimeRequestOptions;
}

/**
 * Bilibili 提供方配置
 */
export interface BilibiliProviderConfig {
	/** 是否启用 Bilibili 同步能力 */
	enable: boolean;
	/** Bilibili 用户 UID / vmid（必填，未填时自动禁用） */
	vmid: string;
	/**
	 * 保存 SESSDATA 的环境变量名称（默认为 "BILI_SESSDATA"）。
	 * 注意：此处仅配置环境变量键名，私密 Token 严禁硬编码进本文件或 Git。
	 */
	sessdataEnv?: string;
	/** 封面处理策略 */
	cover?: {
		mode: AnimeCoverMode;
		/** 可选封面镜像前缀（如加速 CDN 或反代前缀） */
		mirror?: string;
		/** 是否使用 WebP 图片优化参数（默认 true） */
		useWebp?: boolean;
	};
	/** 可选网络请求参数 */
	request?: AnimeRequestOptions;
}

/**
 * 快照存储与健康度策略
 */
export interface AnimeSnapshotConfig {
	/** 快照保存目录（相对于项目根目录，默认 "src/data/anime-snapshots"） */
	directory: string;
	/** 快照过期告警天数（仅构建日志提示，不触发运行期自动请求，默认 30 天） */
	staleAfterDays?: number;
	/** 当外部同步失败时，是否保留上一次成功的有效快照（默认 true） */
	keepLastValid: boolean;
}

/**
 * 番剧模块全局完整配置契约
 */
export interface AnimeConfig {
	/**
	 * 是否启用番剧页面。
	 * 注：设置为 true 仅表示开启 `/anime/` 路由与本地数据渲染，不代表发起任何网络请求。
	 */
	enable: boolean;
	/** 主数据源配置 */
	source: AnimeSourceConfig;
	/** 失败降级配置 */
	fallback: AnimeFallbackConfig;
	/** 各数据源提供方设置 */
	providers: {
		bangumi: BangumiProviderConfig;
		bilibili: BilibiliProviderConfig;
	};
	/** 快照策略 */
	snapshot: AnimeSnapshotConfig;
}

/**
 * 条目来源身份标识（用于跨源去重与多链接归档）
 */
export interface AnimeIdentity {
	provider: "local" | "bangumi" | "bilibili";
	sourceId?: string;
	seasonId?: string;
	subjectId?: string;
}

/**
 * 版本化快照数据封套（Envelope）规范
 */
export interface AnimeSnapshot {
	schemaVersion: 1;
	provider: AnimeProvider;
	fetchedAt: string;
	accountRef: string;
	items: AnimeItem[];
}

/**
 * 经解析与校验后的最终安全 Anime 运行时选项
 */
export interface ResolvedAnimeOptions {
	/** 页面是否启用 */
	enable: boolean;
	/** 规范化后的数据源 */
	source: {
		kind: AnimeSourceKind;
		provider?: AnimeProvider;
		file?: string;
		fetchOnDev?: boolean;
	};
	/** 规范化后的降级策略 */
	fallback: AnimeFallbackKind;
	/** 规范化后的快照配置 */
	snapshot: {
		directory: string;
		staleAfterDays: number;
		keepLastValid: boolean;
	};
}
