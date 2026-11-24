import { visit } from "unist-util-visit";

/** Adapts Luogu's Tuack table marker to the shared directive renderer. */
export function remarkLuogu() {
	return (tree) => {
		visit(tree, "leafDirective", (node, index, parent) => {
			if (
				node.name !== "cute-table" ||
				!Object.hasOwn(node.attributes ?? {}, "tuack") ||
				typeof index !== "number" ||
				!parent
			) {
				return;
			}

			const table = parent.children[index + 1];
			if (table?.type !== "table") return;

			parent.children.splice(index, 2, {
				type: "containerDirective",
				name: "tuack-table",
				attributes: {},
				children: [table],
			});
		});

		visit(tree, "containerDirective", (node) => {
			if (node.name !== "align" || node.attributes?.center === undefined) {
				return;
			}
			node.name = "luogu-align-center";
		});
	};
}
