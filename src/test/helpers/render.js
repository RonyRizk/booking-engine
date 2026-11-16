import { Children, cloneElement, createElement, Fragment, isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const decode = (text) =>
    text
        .replace(/&nbsp;?/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'");

/** The text a reader sees: no tags, styles, scripts or comments. */
export const visibleText = (html) =>
    decode(
        html
            .replace(/<!--[\s\S]*?-->/g, "")
            .replace(/<(style|script|head)[\s\S]*?<\/\1>/gi, " ")
            // Inline tags don't break words; everything else does.
            .replace(/<\/?(b|strong|i|em|span|a|u|small|sup|sub)\b[^>]*>/gi, "")
            .replace(/<[^>]+>/g, " "),
    )
        .replace(/\s+/g, " ")
        .trim();

/**
 * Renders a server-component tree, awaiting async components, the way the
 * App Router does. Printing components use no hooks or client APIs.
 *
 * @param {import("react").ReactNode} node
 * @returns {Promise<string>}
 */
export const renderServer = async (node) => renderToStaticMarkup(await resolve(node));

async function resolve(node) {
    if (Array.isArray(node)) return Promise.all(node.map(resolve));
    if (!isValidElement(node)) return node;
    const { type, props } = node;
    if (typeof type === "function") {
        return resolve(await type(props));
    }
    if (props?.children === undefined) return node;
    const children = await resolve(props.children);
    return type === Fragment
        ? createElement(Fragment, { key: node.key }, ...Children.toArray(children))
        : cloneElement(node, undefined, children);
}
