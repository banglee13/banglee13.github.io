function cellText(cell) {
	if (!Array.isArray(cell.children)) return null;
	if (cell.children.length !== 1) return null;
	const [paragraph] = cell.children;
	if (paragraph?.tagName !== "p" || paragraph.children?.length !== 1) {
		return null;
	}
	const [text] = paragraph.children;
	return text?.type === "text" ? text.value.trim() : null;
}

function processTable(table) {
	const rows = [];
	function collectRows(node) {
		if (node?.type !== "element") return;
		if (node.tagName === "tr") rows.push(node);
		else for (const child of node.children ?? []) collectRows(child);
	}
	collectRows(table);

	const grid = [];
	for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
		const row = rows[rowIndex];
		const cells = (row.children ?? []).filter(
			(child) => child?.type === "element" && ["td", "th"].includes(child.tagName),
		);
		let columnIndex = 0;
		for (const cell of cells) {
			const marker = cellText(cell);
			if (marker !== "^") {
				while (grid[rowIndex]?.[columnIndex]) columnIndex += 1;
			}
			if (marker === "^") {
				const anchor = grid[rowIndex - 1]?.[columnIndex];
				if (!anchor) {
					columnIndex += 1;
					continue;
				}
				anchor.properties ??= {};
				anchor.properties.rowSpan = (anchor.properties.rowSpan ?? 1) + 1;
				for (let offset = 0; offset < (anchor.properties.colSpan ?? 1); offset += 1) {
					(grid[rowIndex] ??= [])[columnIndex + offset] = anchor;
				}
				row.children.splice(row.children.indexOf(cell), 1);
				columnIndex += anchor.properties.colSpan ?? 1;
				continue;
			}
			if (marker === "<") {
				const anchor = grid[rowIndex]?.[columnIndex - 1];
				if (!anchor) {
					columnIndex += 1;
					continue;
				}
				anchor.properties ??= {};
				anchor.properties.colSpan = (anchor.properties.colSpan ?? 1) + 1;
				(grid[rowIndex] ??= [])[columnIndex] = anchor;
				row.children.splice(row.children.indexOf(cell), 1);
				continue;
			}
			(grid[rowIndex] ??= [])[columnIndex] = cell;
			columnIndex += 1;
		}
	}
}

export function rehypeLuoguTableSpans() {
	return (tree) => {
		function visit(node) {
			if (node?.type !== "element") return;
			if (node.tagName === "table") processTable(node);
			else for (const child of node.children ?? []) visit(child);
		}
		visit(tree);
	};
}
