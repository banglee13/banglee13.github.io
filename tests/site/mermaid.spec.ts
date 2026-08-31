import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const POST_PATH = "/posts/markdown-extended/";
const DEMO_PATH = "/posts/markdown-mermaid/";

async function waitForViewer(page: import("@playwright/test").Page) {
	const diagram = page.locator(".markdown-mermaid").first();
	await expect(diagram).toHaveAttribute("data-mermaid-interaction", "ready", {
		timeout: 15_000,
	});
	return diagram;
}

test.describe("Mermaid diagrams", () => {
	test("preserves an SSR fallback and renders a themed SVG", async ({
		page,
		request,
	}) => {
		const response = await request.get(POST_PATH);
		expect(response.ok()).toBe(true);
		const html = await response.text();
		expect(html).toContain('data-mermaid-state="pending"');
		expect(html).toContain("Markdown rendering pipeline");

		await page.goto(POST_PATH, { waitUntil: "domcontentloaded" });
		const diagram = page.locator(".markdown-mermaid");
		await expect(diagram).toHaveAttribute("data-mermaid-state", "ready", {
			timeout: 15_000,
		});
		await expect(diagram.locator("[data-mermaid-svg]")).toHaveCount(1);
		await expect(diagram.locator("svg title")).toHaveText(
			"Markdown rendering pipeline",
		);
		await expect(diagram.locator(".markdown-mermaid__fallback")).toBeHidden();
		expect(
			(await new AxeBuilder({ page }).include(".markdown-mermaid").analyze())
				.violations,
		).toEqual([]);

		const firstTheme = await diagram.getAttribute("data-mermaid-theme");
		await page.evaluate(() =>
			document.documentElement.classList.toggle("dark"),
		);
		await expect
			.poll(() => diagram.getAttribute("data-mermaid-theme"))
			.not.toBe(firstTheme);
		expect(
			(await new AxeBuilder({ page }).include(".markdown-mermaid").analyze())
				.violations,
		).toEqual([]);
	});

	test("stays within the article on mobile", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(POST_PATH, { waitUntil: "domcontentloaded" });
		const diagram = page.locator(".markdown-mermaid");
		await expect(diagram).toHaveAttribute("data-mermaid-state", "ready", {
			timeout: 15_000,
		});

		await expect(diagram).toHaveAttribute("data-mermaid-interaction", "ready");
		const toolbarRow = diagram.locator("[data-mermaid-toolbar]");
		const controlsButton = diagram.getByRole("button", {
			name: "Diagram controls",
		});
		const toolbarBounds = await toolbarRow.boundingBox();
		const controlsBounds = await controlsButton.boundingBox();
		if (!toolbarBounds || !controlsBounds) {
			throw new Error("Compact Mermaid controls are missing");
		}
		expect(toolbarBounds.height).toBeLessThanOrEqual(40);
		expect(controlsBounds.width).toBeLessThanOrEqual(40);
		expect(controlsBounds.height).toBeLessThanOrEqual(40);
		await expect(diagram.getByRole("button", { name: "Zoom in" })).toBeHidden();
		const bounds = await diagram.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			const viewportElement = element.querySelector(
				".markdown-mermaid__viewport",
			);
			const svgElement = element.querySelector("[data-mermaid-svg]");
			if (!viewportElement || !svgElement) {
				throw new Error("Mermaid interaction elements are missing");
			}
			const viewport = viewportElement.getBoundingClientRect();
			const svg = svgElement.getBoundingClientRect();
			return {
				left: rect.left,
				right: rect.right,
				viewportWidth: innerWidth,
				fitted:
					svg.left >= viewport.left - 1 &&
					svg.right <= viewport.right + 1 &&
					svg.top >= viewport.top - 1 &&
					svg.bottom <= viewport.bottom + 1,
			};
		});
		expect(bounds.left).toBeGreaterThanOrEqual(0);
		expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth + 1);
		expect(bounds.fitted).toBe(true);
	});

	test("zooms, resets, and leaves ordinary wheel scrolling to the page", async ({
		page,
	}) => {
		await page.goto(POST_PATH, { waitUntil: "domcontentloaded" });
		const diagram = await waitForViewer(page);
		const viewport = diagram.locator(".markdown-mermaid__viewport");
		await expect(viewport).toHaveAttribute("data-mermaid-user-zoom", "1.0000");
		const controlsButton = diagram.getByRole("button", {
			name: "Diagram controls",
		});
		await expect(controlsButton).toBeVisible();
		await expect(diagram.getByRole("button", { name: "Zoom in" })).toBeHidden();
		await controlsButton.click();

		await diagram.getByRole("button", { name: "Zoom in" }).click();
		await expect
			.poll(() =>
				viewport
					.locator(".markdown-mermaid__transform")
					.evaluate((element) => getComputedStyle(element).transitionDuration),
			)
			.toBe("0.25s");
		await expect
			.poll(async () =>
				Number(await viewport.getAttribute("data-mermaid-user-zoom")),
			)
			.toBeGreaterThan(1);
		await page.waitForTimeout(260);

		const viewportBox = await viewport.boundingBox();
		if (!viewportBox) throw new Error("Mermaid viewport is missing");
		const svg = viewport.locator("svg");
		const beforePan = await svg.boundingBox();
		if (!beforePan) throw new Error("Mermaid SVG is missing");
		await page.mouse.move(
			viewportBox.x + viewportBox.width / 2,
			viewportBox.y + viewportBox.height / 2,
		);
		await page.mouse.down();
		await page.mouse.move(
			viewportBox.x + viewportBox.width / 2 - 80,
			viewportBox.y + viewportBox.height / 2,
			{ steps: 8 },
		);
		await page.mouse.up();
		await expect
			.poll(async () => (await svg.boundingBox())?.x ?? beforePan.x)
			.toBeLessThan(beforePan.x - 40);

		const beforeTouchPan = await svg.boundingBox();
		if (!beforeTouchPan) throw new Error("Mermaid SVG is missing");
		const touchStart = {
			x: viewportBox.x + viewportBox.width / 2,
			y: viewportBox.y + viewportBox.height / 2,
		};
		await viewport.dispatchEvent("pointerdown", {
			bubbles: true,
			buttons: 1,
			clientX: touchStart.x,
			clientY: touchStart.y,
			isPrimary: true,
			pointerId: 41,
			pointerType: "touch",
		});
		await page.evaluate(({ x, y }) => {
			document.dispatchEvent(
				new PointerEvent("pointermove", {
					bubbles: true,
					buttons: 1,
					clientX: x + 60,
					clientY: y + 30,
					isPrimary: true,
					pointerId: 41,
					pointerType: "touch",
				}),
			);
			document.dispatchEvent(
				new PointerEvent("pointerup", {
					bubbles: true,
					clientX: x + 60,
					clientY: y + 30,
					isPrimary: true,
					pointerId: 41,
					pointerType: "touch",
				}),
			);
		}, touchStart);
		await expect
			.poll(async () => (await svg.boundingBox())?.x ?? beforeTouchPan.x)
			.toBeGreaterThan(beforeTouchPan.x + 30);

		await diagram.getByRole("button", { name: "Reset view" }).click();
		await expect(viewport).toHaveAttribute("data-mermaid-user-zoom", "1.0000");

		await viewport.scrollIntoViewIfNeeded();
		const beforeScroll = await page.evaluate(() => scrollY);
		await viewport.hover();
		await page.mouse.wheel(0, -240);
		await expect
			.poll(() => page.evaluate(() => scrollY))
			.toBeLessThan(beforeScroll);
		await expect(viewport).toHaveAttribute("data-mermaid-user-zoom", "1.0000");

		await viewport.dispatchEvent("wheel", { ctrlKey: true, deltaY: -120 });
		await expect
			.poll(async () =>
				Number(await viewport.getAttribute("data-mermaid-user-zoom")),
			)
			.toBeGreaterThan(1);

		await page.mouse.click(8, 8);
		await expect(diagram.getByRole("button", { name: "Zoom in" })).toBeHidden();
	});

	test("keeps fullscreen modal state across theme renders and restores focus", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 640 });
		await page.goto(POST_PATH, { waitUntil: "domcontentloaded" });
		const diagram = await waitForViewer(page);
		await diagram.getByRole("button", { name: "Diagram controls" }).click();
		const openButton = diagram.getByRole("button", { name: "Open fullscreen" });
		await openButton.click();

		const dialog = page.getByRole("dialog", {
			name: /Fullscreen diagram:/,
		});
		await expect(dialog).toBeVisible();
		const fullscreenLayout = await dialog.evaluate((element) => {
			const content = element.querySelector<HTMLElement>(".m3-dialog__content");
			const title = element.querySelector<HTMLElement>(".m3-dialog__title");
			const toolbar = element.querySelector<HTMLElement>(
				".mermaid-viewer__fullscreen-toolbar .m3-toolbar",
			);
			const rect = element.getBoundingClientRect();
			const titleRect = title?.getBoundingClientRect();
			const toolbarRect = toolbar?.getBoundingClientRect();
			const dialogCenter = (rect.left + rect.right) / 2;
			const toolbarCenter = toolbarRect
				? (toolbarRect.left + toolbarRect.right) / 2
				: 0;
			return {
				clientHeight: element.clientHeight,
				scrollHeight: element.scrollHeight,
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
				scrollLeft: element.scrollLeft,
				contentClientHeight: content?.clientHeight ?? 0,
				contentScrollHeight: content?.scrollHeight ?? 0,
				left: rect.left,
				right: rect.right,
				titleLeft: titleRect?.left ?? 0,
				toolbarCenterOffset: Math.abs(toolbarCenter - dialogCenter),
				viewportWidth: innerWidth,
			};
		});
		expect(fullscreenLayout.scrollHeight).toBeLessThanOrEqual(
			fullscreenLayout.clientHeight,
		);
		expect(fullscreenLayout.scrollWidth).toBeLessThanOrEqual(
			fullscreenLayout.clientWidth + 1,
		);
		expect(fullscreenLayout.scrollLeft).toBe(0);
		expect(fullscreenLayout.contentScrollHeight).toBeLessThanOrEqual(
			fullscreenLayout.contentClientHeight,
		);
		expect(fullscreenLayout.left).toBeGreaterThan(0);
		expect(fullscreenLayout.right).toBeLessThan(fullscreenLayout.viewportWidth);
		expect(fullscreenLayout.titleLeft).toBeGreaterThanOrEqual(
			fullscreenLayout.left,
		);
		expect(fullscreenLayout.toolbarCenterOffset).toBeLessThanOrEqual(2);
		await expect(
			dialog.locator("[data-mermaid-fullscreen-viewport] svg"),
		).toHaveCount(1);
		const fullscreenViewport = dialog.locator(
			"[data-mermaid-fullscreen-viewport]",
		);
		const fullscreenSvg = fullscreenViewport.locator("svg");
		await expect(fullscreenViewport).toHaveAttribute(
			"data-mermaid-pannable",
			"true",
		);
		const viewportBox = await fullscreenViewport.boundingBox();
		const beforePan = await fullscreenSvg.boundingBox();
		if (!viewportBox || !beforePan) {
			throw new Error("Fullscreen Mermaid interaction elements are missing");
		}
		await page.mouse.move(
			viewportBox.x + viewportBox.width / 2,
			viewportBox.y + viewportBox.height / 2,
		);
		await page.mouse.down();
		await page.mouse.move(
			viewportBox.x + viewportBox.width / 2 + 80,
			viewportBox.y + viewportBox.height / 2 + 40,
			{ steps: 8 },
		);
		await page.mouse.up();
		await expect
			.poll(async () => (await fullscreenSvg.boundingBox())?.x ?? beforePan.x)
			.toBeGreaterThan(beforePan.x + 40);
		const firstTheme = await diagram.getAttribute("data-mermaid-theme");
		await page.evaluate(() =>
			document.documentElement.classList.toggle("dark"),
		);
		await expect
			.poll(() => diagram.getAttribute("data-mermaid-theme"))
			.not.toBe(firstTheme);
		await expect(dialog).toBeVisible();
		await expect(
			dialog.locator("[data-mermaid-fullscreen-viewport] svg"),
		).toHaveCount(1);

		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
		await expect(openButton).toBeFocused();
	});

	test("renders after Swup replaces the article content", async ({ page }) => {
		await page.goto("/posts/guide/", { waitUntil: "domcontentloaded" });
		await page.waitForFunction(() => Boolean(window.swup?.hooks));
		await page.evaluate((path) => window.swup?.navigate(path), POST_PATH);
		await page.waitForURL(`**${POST_PATH}`);

		const diagram = page.locator(".markdown-mermaid");
		await expect(diagram).toHaveAttribute("data-mermaid-state", "ready", {
			timeout: 15_000,
		});
		await expect(diagram.locator("[data-mermaid-svg]")).toHaveCount(1);
	});

	test("renders every diagram in the dedicated demo article", async ({
		page,
	}) => {
		await page.goto(DEMO_PATH, { waitUntil: "domcontentloaded" });
		const diagrams = page.locator(".markdown-mermaid");
		await expect(diagrams).toHaveCount(14);
		await expect
			.poll(
				() =>
					diagrams.evaluateAll(
						(elements) =>
							elements.filter(
								(element) => element.dataset.mermaidState === "ready",
							).length,
					),
				{ timeout: 30_000 },
			)
			.toBe(14);
		await expect(diagrams.locator("[data-mermaid-svg]")).toHaveCount(14);
		await expect(diagrams.locator("[data-mermaid-toolbar]")).toHaveCount(14);
		const regions = diagrams.locator(
			'.markdown-mermaid__diagram[role="region"]',
		);
		await expect(regions).toHaveCount(14);
		expect(
			await regions.evaluateAll((elements) =>
				elements.every(
					(element) =>
						Boolean(element.getAttribute("aria-label")) ||
						Boolean(element.getAttribute("aria-labelledby")),
				),
			),
		).toBe(true);
		expect(
			(await new AxeBuilder({ page }).include(".markdown-mermaid").analyze())
				.violations,
		).toEqual([]);
	});

	test("keeps fullscreen modal and controls centered on compact mobile screens with long diagram titles", async ({
		page,
	}) => {
		await page.setViewportSize({ width: 360, height: 640 });
		await page.goto(DEMO_PATH, { waitUntil: "domcontentloaded" });
		const diagram = await waitForViewer(page);
		await diagram.getByRole("button", { name: "Diagram controls" }).click();
		await diagram.getByRole("button", { name: "Open fullscreen" }).click();

		const dialog = page.getByRole("dialog", {
			name: /Fullscreen diagram:/,
		});
		await expect(dialog).toBeVisible();
		const layout = await dialog.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			const title = element.querySelector<HTMLElement>(".m3-dialog__title");
			const closeBtn = element.querySelector<HTMLElement>(
				".m3-dialog__close-btn",
			);
			const toolbar = element.querySelector<HTMLElement>(
				".mermaid-viewer__fullscreen-toolbar .m3-toolbar",
			);
			const titleRect = title?.getBoundingClientRect();
			const closeRect = closeBtn?.getBoundingClientRect();
			const toolbarRect = toolbar?.getBoundingClientRect();
			const dialogCenter = (rect.left + rect.right) / 2;
			const toolbarCenter = toolbarRect
				? (toolbarRect.left + toolbarRect.right) / 2
				: 0;
			return {
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
				scrollLeft: element.scrollLeft,
				dialogLeft: rect.left,
				dialogRight: rect.right,
				titleLeft: titleRect?.left ?? 0,
				titleRight: titleRect?.right ?? 0,
				closeLeft: closeRect?.left ?? 0,
				closeRight: closeRect?.right ?? 0,
				toolbarCenterOffset: Math.abs(toolbarCenter - dialogCenter),
				viewportWidth: innerWidth,
			};
		});

		expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
		expect(layout.scrollLeft).toBe(0);
		expect(layout.dialogLeft).toBeGreaterThan(0);
		expect(layout.dialogRight).toBeLessThan(layout.viewportWidth);
		expect(layout.titleLeft).toBeGreaterThanOrEqual(layout.dialogLeft);
		expect(layout.titleRight).toBeLessThanOrEqual(layout.closeLeft);
		expect(layout.closeRight).toBeLessThanOrEqual(layout.dialogRight);
		expect(layout.toolbarCenterOffset).toBeLessThanOrEqual(2);

		await page.keyboard.press("Escape");
		await expect(dialog).toBeHidden();
	});

	test("maintains readable contrast for edge labels and nodes in dark mode", async ({
		page,
	}) => {
		await page.goto(DEMO_PATH, { waitUntil: "domcontentloaded" });
		const diagrams = page.locator(".markdown-mermaid");
		await expect
			.poll(
				() =>
					diagrams.evaluateAll(
						(elements) =>
							elements.filter(
								(element) => element.dataset.mermaidState === "ready",
							).length,
					),
				{ timeout: 30_000 },
			)
			.toBe(14);

		await page.evaluate(() => {
			document.documentElement.classList.add("dark");
		});
		await expect
			.poll(
				() =>
					diagrams.evaluateAll(
						(elements) =>
							elements.filter(
								(element) =>
									element.dataset.mermaidState === "ready" &&
									element.dataset.mermaidTheme?.startsWith("dark|"),
							).length,
					),
				{ timeout: 30_000 },
			)
			.toBe(14);

		const flowchart = diagrams.first();
		const edgeLabelInfo = await flowchart.evaluate((element) => {
			const edgeLabels = Array.from(
				element.querySelectorAll<HTMLElement>(".edgeLabel"),
			);
			return edgeLabels.map((el) => {
				const style = getComputedStyle(el);
				return {
					color: style.color,
					visibility: style.visibility,
					display: style.display,
				};
			});
		});
		expect(edgeLabelInfo.length).toBeGreaterThan(0);
		for (const label of edgeLabelInfo) {
			expect(label.visibility).not.toBe("hidden");
			expect(label.display).not.toBe("none");
		}

		expect(
			(await new AxeBuilder({ page }).include(".markdown-mermaid").analyze())
				.violations,
		).toEqual([]);
	});
});
