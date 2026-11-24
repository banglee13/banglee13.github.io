import assert from "node:assert/strict";
import { test } from "node:test";

import { siteMarkdownProcessor } from "../../../../src/utils/markdown-processor.mjs";

const renderer = await siteMarkdownProcessor.createRenderer({});

async function render(markdown) {
	return (await renderer.render(markdown)).code;
}

test("merges table cells upward and to the left", async () => {
	const { code: html, metadata } = await renderer.render(`| Group | Value | Note | Extra |
| --- | --- | --- | --- |
| A | 10 | X | Y |
| ^ | 20 | < | < |`);

	assert.match(html, /<td rowspan="2">A<\/td>/);
	assert.deepEqual(metadata.frontmatter.markdownSyntaxes.syntaxes, ["table-span"]);
	assert.match(html, /<td colspan="3">20<\/td>/);
	assert.doesNotMatch(html, />\^<|>&lt;<\/td>/);
});

test("extends a rectangular span once and preserves an incomplete continuation", async () => {
	const html = await render(`| First | Second | Third |
| --- | --- | --- |
| Group | < | One |
| ^ | ^ | Two |
| ^ | Other | Three |`);

	assert.match(html, /<td colspan="2" rowspan="2">Group<\/td>/);
	assert.match(html, /<td>\^<\/td><td>Other<\/td>/);
});

test("renders Tuack table, centered content, and epigraph as SSR markup", async () => {
	const html = await render(`::cute-table{tuack}

| Test | Value |
| --- | --- |
| 1 | 10 |

:::align{center}

Centered text.

:::

:::epigraph[——author]
Quoted text.
:::`);

	assert.match(
		html,
		/class="m3-luogu-tuack-table">\s*<div class="markdown-table-scroll"[^>]*>\s*<table>/,
	);
	assert.match(html, /class="m3-luogu-align-center"/);
	assert.match(html, /<figure class="m3-luogu-epigraph">/);
	assert.match(html, /<figcaption>——author<\/figcaption>/);
});

test("renders Luogu callfold variants as native details with optional open state", async () => {
	const html = await render(`::::info[More information]
Closed content.
::::

::::success[Completed]{open}
Open content.
::::

::::warning[Warning]
Warning content.
::::

::::error[Error]
Error content.
::::`);

	assert.equal(html.match(/<details class="admonition/g)?.length, 4);
	assert.match(html, /<details class="admonition bdm-info[^>]*>/);
	assert.match(html, /<details class="admonition bdm-tip[^>]* open>/);
	assert.match(html, /<summary class="m3-admonition__header m3-state-layer">/);
	assert.match(html, /Error content\./);
});

test("leaves non-marker cells and unrelated directive syntax intact", async () => {
	const html = await render(`| Value |
| --- |
| ^ as text |

:::align{right}
Unchanged.
:::`);

	assert.match(html, /<td>\^ as text<\/td>/);
	assert.doesNotMatch(html, /m3-luogu-align-center/);
	assert.match(html, /<align right="">/);
});
