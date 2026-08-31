import { expect, test } from "@playwright/test";

test.describe("top app bar content alignment", () => {
	test("centers navigation while keeping the blog title on the left", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });

		const content = page.locator("#navbar > div").first();
		const title = content.locator(":scope > a");
		const nav = content.locator(":scope > nav");

		await expect(title).toHaveText("Shirone");
		await expect(title).not.toHaveClass(/lg:absolute/);
		await expect(nav).toBeVisible();
		await expect(nav).toHaveClass(/lg:absolute/);

		const geometry = await Promise.all([
			content.boundingBox(),
			nav.boundingBox(),
		]);
		expect(geometry[0]).not.toBeNull();
		expect(geometry[1]).not.toBeNull();
		expect(geometry[1]!.x + geometry[1]!.width / 2).toBeCloseTo(
			geometry[0]!.x + geometry[0]!.width / 2,
			0,
		);
	});
});
