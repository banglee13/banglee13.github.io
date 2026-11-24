import { visit } from "unist-util-visit";

function marker(cell) {
	const [content] = cell.children;
	return cell.children.length === 1 && content.type === "text"
		? content.value.trim()
		: null;
}

function mergeRows(section) {
	// Raw HTML may already define a grid with occupied columns.
	if (
		section.children.some((row) =>
			row.children?.some(
				(cell) => cell.properties?.rowSpan || cell.properties?.colSpan,
			),
		)
	)
		return;
	let previous = [];
	for (const row of section.children.filter((node) => node.tagName === "tr")) {
		const cells = row.children.filter((node) =>
			["td", "th"].includes(node.tagName),
		);
		const owners = [];
		const removed = new Set();
		for (let column = 0; column < cells.length; column++) {
			const cell = cells[column];
			const symbol = marker(cell);
			const above = previous[column];
			// A vertical extension must cover the whole width of the cell above.
			if (
				symbol === "^" &&
				above?.start === column &&
				!markerIsLiteral(above.cell)
			) {
				const width = above.cell.properties.colSpan ?? 1;
				const covered = cells.slice(column, column + width);
				if (
					covered.length === width &&
					covered.every((item) => ["^", "<"].includes(marker(item)))
				) {
					above.cell.properties.rowSpan =
						(above.cell.properties.rowSpan ?? 1) + 1;
					for (const item of covered) {
						owners.push(above);
						removed.add(item);
					}
					column += width - 1;
					continue;
				}
			}
			const left = owners[column - 1];
			if (symbol === "<" && left?.row === row && !markerIsLiteral(left.cell)) {
				left.cell.properties.colSpan = (left.cell.properties.colSpan ?? 1) + 1;
				owners.push(left);
				removed.add(cell);
				continue;
			}
			owners.push({ cell, row, start: column });
		}
		if (removed.size)
			row.children = row.children.filter((node) => !removed.has(node));
		previous = owners;
	}
}

function markerIsLiteral(cell) {
	return ["^", "<"].includes(marker(cell));
}

export function rehypeLuoguTableSpans() {
	return (tree) => {
		visit(tree, "element", (table) => {
			if (table.tagName !== "table") return;
			for (const section of table.children) {
				if (section.tagName === "thead" || section.tagName === "tbody")
					mergeRows(section);
			}
		});
	};
}
