import {
	existsSync,
	mkdirSync,
	renameSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	animeConfig,
	resolveAnimeOptions,
} from "../../src/config/animeConfig.ts";
import {
	normalizeAnimeItem,
	sortAnimeList,
} from "../../src/utils/anime/normalize.ts";
import { loadEnvFile } from "./load-env.mjs";
import { fetchBangumiData } from "./providers/bangumi.mjs";
import { fetchBilibiliData } from "./providers/bilibili.mjs";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

// 加载环境变量
loadEnvFile();

const SENSITIVE_PATTERNS = [
	/\bSESSDATA\b/i,
	/\bcookie\s*[:=]/i,
	/\bauthorization\s*[:=]/i,
	/\baccess_token\b/i,
	/\brefresh_token\b/i,
	/\bcsrf\b/i,
];

function scanForSensitiveData(jsonString) {
	for (const pattern of SENSITIVE_PATTERNS) {
		if (pattern.test(jsonString)) {
			throw new Error(
				`Security Violation: Forbidden sensitive pattern detected in snapshot data: ${pattern.toString()}`,
			);
		}
	}
}

async function syncProvider(providerName, targetDir) {
	console.log("\n========================================");
	console.log(`Starting sync for provider: ${providerName.toUpperCase()}`);
	console.log("========================================");

	let fetchResult;

	if (providerName === "bangumi") {
		const bgmConfig = animeConfig.providers?.bangumi;
		if (!bgmConfig?.userId || bgmConfig.userId === "your-bangumi-id") {
			throw new Error(
				"Bangumi userId is not configured in src/config/animeConfig.ts",
			);
		}
		fetchResult = await fetchBangumiData(bgmConfig);
	} else if (providerName === "bilibili") {
		const biliConfig = animeConfig.providers?.bilibili;
		if (!biliConfig?.vmid || biliConfig.vmid === "your-bilibili-vmid") {
			throw new Error(
				"Bilibili vmid is not configured in src/config/animeConfig.ts",
			);
		}
		fetchResult = await fetchBilibiliData(biliConfig);
	} else {
		throw new Error(`Unsupported anime provider: ${providerName}`);
	}

	const normalizedItems = [];
	for (const rawItem of fetchResult.rawItems) {
		const item = normalizeAnimeItem(rawItem);
		if (item) {
			normalizedItems.push(item);
		}
	}

	const sortedItems = sortAnimeList(normalizedItems);

	const snapshot = {
		schemaVersion: 1,
		provider: providerName,
		fetchedAt: new Date().toISOString(),
		accountRef: String(fetchResult.accountRef || ""),
		items: sortedItems,
	};

	const jsonContent = JSON.stringify(snapshot, null, 2);

	// 敏感凭据扫描
	scanForSensitiveData(jsonContent);

	// 确保目录存在
	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	const targetFile = join(targetDir, `${providerName}.json`);
	const tempFile = join(targetDir, `.temp-${providerName}-${Date.now()}.json`);

	try {
		// 原子写入：先写临时文件，校验成功后再替换正式快照
		writeFileSync(tempFile, jsonContent, "utf-8");
		renameSync(tempFile, targetFile);
		console.log(
			`[anime-sync] ✓ Successfully synced ${sortedItems.length} items to ${targetFile}`,
		);
	} catch (err) {
		if (existsSync(tempFile)) {
			try {
				unlinkSync(tempFile);
			} catch {}
		}
		throw err;
	}
}

function parseCliArgs() {
	const args = process.argv.slice(2);
	let provider = null;

	for (let i = 0; i < args.length; i++) {
		if (args[i] === "--provider" && args[i + 1]) {
			provider = args[i + 1].toLowerCase();
			i++;
		} else if (args[i].startsWith("--provider=")) {
			provider = args[i].split("=")[1].toLowerCase();
		}
	}

	return { provider };
}

async function main() {
	const resolved = resolveAnimeOptions(animeConfig);
	const { provider: cliProvider } = parseCliArgs();

	const targetDir = join(projectRoot, resolved.snapshot.directory);

	let providersToSync = [];
	if (cliProvider === "all") {
		providersToSync = ["bangumi", "bilibili"];
	} else if (cliProvider === "bangumi" || cliProvider === "bilibili") {
		providersToSync = [cliProvider];
	} else if (resolved.source.kind === "snapshot" && resolved.source.provider) {
		providersToSync = [resolved.source.provider];
	} else {
		// 默认检查哪些 provider 配置了有效 ID 并启用
		if (
			animeConfig.providers?.bangumi?.enable &&
			animeConfig.providers?.bangumi?.userId
		) {
			providersToSync.push("bangumi");
		}
		if (
			animeConfig.providers?.bilibili?.enable &&
			animeConfig.providers?.bilibili?.vmid
		) {
			providersToSync.push("bilibili");
		}
		if (providersToSync.length === 0) {
			console.log(
				"[anime-sync] No active provider specified or enabled with valid ID.",
			);
			console.log(
				"Usage: node scripts/anime/sync.mjs --provider <bangumi|bilibili|all>",
			);
			process.exit(0);
		}
	}

	let hasError = false;
	for (const p of providersToSync) {
		try {
			await syncProvider(p, targetDir);
		} catch (error) {
			hasError = true;
			console.error(
				`[anime-sync] ✘ Failed to sync provider "${p}":`,
				error.message,
			);
		}
	}

	if (hasError) {
		process.exit(1);
	}
}

main().catch((err) => {
	console.error("[anime-sync] Fatal error:", err);
	process.exit(1);
});
