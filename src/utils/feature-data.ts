/**
 * 特色页面数据解析与合并工具。
 * 遵循「配置管行为，数据管内容」原则：
 * 将 src/config/*Config.ts 的控制行为（disabledKeys、order 等）
 * 应用于 src/data/*.ts 的内容数据集合。
 */
import { devicesData } from "../data/devices.ts";
import { projectsData } from "../data/projects.ts";
import { skillsData } from "../data/skills.ts";
import { timelineData } from "../data/timeline.ts";
import type { DeviceItem, DevicesConfig } from "../types/devicesConfig.ts";
import type { ProjectItem, ProjectsConfig } from "../types/projectsConfig.ts";
import type { SkillItem, SkillsConfig } from "../types/skillsConfig.ts";
import type { TimelineConfig, TimelineItem } from "../types/timelineConfig.ts";

/**
 * 依据禁用列表过滤条目（纯函数）。
 */
export function filterByDisabledKeys<T>(
	items: readonly T[],
	disabledKeys?: readonly string[],
	getKey: (item: T) => string = (item) =>
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).key ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).id ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).name ??
		(
			item as unknown as {
				key?: string;
				id?: string;
				name?: string;
				title?: string;
			}
		).title ??
		"",
): T[] {
	if (!disabledKeys || disabledKeys.length === 0) {
		return [...items];
	}
	const disabledSet = new Set(disabledKeys);
	return items.filter((item) => !disabledSet.has(getKey(item)));
}

/**
 * 解析项目页展示数据。
 */
export function resolveProjectsData(
	config: ProjectsConfig,
	customItems?: readonly ProjectItem[],
): ProjectItem[] {
	const source = customItems ?? config.items ?? projectsData;
	const enabledItems = source.filter((item) => item.enable !== false);
	return filterByDisabledKeys(
		enabledItems,
		config.disabledKeys,
		(item) => item.key,
	);
}

/**
 * 解析技能页展示数据。
 */
export function resolveSkillsData(
	config: SkillsConfig,
	customItems?: readonly SkillItem[],
): SkillItem[] {
	const source = customItems ?? config.items ?? skillsData;
	const enabledItems = source.filter((item) => item.enable !== false);
	return filterByDisabledKeys(
		enabledItems,
		config.disabledNames ?? config.disabledKeys,
		(item) => item.name,
	);
}

/**
 * 解析时间线页展示数据。
 */
export function resolveTimelineData(
	config: TimelineConfig,
	customItems?: readonly TimelineItem[],
): TimelineItem[] {
	const source = customItems ?? config.items ?? timelineData;
	const enabledItems = source.filter((item) => item.enable !== false);
	const filtered = filterByDisabledKeys(
		enabledItems,
		config.disabledTitles ?? config.disabledKeys,
		(item) => item.title,
	);

	if (config.order === "asc") {
		return [...filtered].reverse();
	}
	return filtered;
}

/**
 * 解析设备页展示数据。
 */
export function resolveDevicesData(
	config: DevicesConfig,
	customItems?: readonly DeviceItem[],
): DeviceItem[] {
	const source = customItems ?? config.items ?? devicesData;
	const enabledItems = source.filter((item) => item.enable !== false);
	return filterByDisabledKeys(
		enabledItems,
		config.disabledIds ?? config.disabledKeys,
		(item) => item.id,
	);
}
