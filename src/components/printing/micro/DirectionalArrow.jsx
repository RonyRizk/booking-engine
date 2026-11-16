import { cn } from "@/lib/utils";

/**
 * The "from → to" arrow between two dates. It points toward the end of the line,
 * so in an RTL document it points left: `.print-arrow` is mirrored under
 * `[dir="rtl"]` in printing.css. Use this rather than an inline arrow SVG or a
 * "→" character, neither of which flips on its own.
 */
export default function DirectionalArrow({ className }) {
    return (
        <svg
            className={cn("print-arrow shrink-0", className)}
            xmlns="http://www.w3.org/2000/svg"
            height={12}
            width={12}
            viewBox="0 0 640 640"
            aria-hidden="true"
        >
            <path fill="currentColor" d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
        </svg>
    );
}
