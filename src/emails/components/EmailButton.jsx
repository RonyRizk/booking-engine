import React from 'react'
import { Button } from "@react-email/components";

/**
 * EmailButton component renders a customizable email button using
 * the React Email <Button> component.
 * 
 * Props:
 * - variant: Determines the visual style of the button. Accepts:
 *   - "primary" (default): Renamed from "button" - styled like a standard CTA button with background color, padding, rounded corners, etc.
 *   - "secondary": Clean button with border and transparent background
 *   - "outline": Button with outline style and hover effects
 *   - "success": Green themed button for positive actions
 *   - "danger": Red themed button for destructive actions
 *   - "compact": Smaller button for less prominent actions
 *   - "pill": More rounded button style
 * 
 * - style: You can override or extend default styles by passing a custom style object.
 * - All other props are passed directly to the <Button> component.
 */
export default function EmailButton({ variant = "primary", ...props }) {
    return (
        <Button {...props} style={{ ...styles[variant] ?? styles["primary"], ...props?.style }} />
    )
}
const base = {
    display: "inline-block",
    textDecoration: "none",
    borderRadius: "28px",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "15px",
    marginRight: "15px",
    marginBottom: "25px",
    marginLeft: "0",
};
const styles = {
    primary: {
        ...base,
        backgroundColor: "#6692b3",
        color: "#ffffff",
        paddingTop: "12px",
        paddingRight: "24px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        border: "none",
    },
    secondary: {
        ...base,
        backgroundColor: "transparent",
        color: "#6692b3",
        paddingTop: "12px",
        paddingRight: "24px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        border: "2px solid #6692b3",
    },
    outline: {
        ...base,
        backgroundColor: "#ffffff",
        color: "#334155",
        paddingTop: "12px",
        paddingRight: "24px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        border: "2px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    success: {
        ...base,
        backgroundColor: "#059669",
        color: "#ffffff",
        paddingTop: "12px",
        paddingRight: "24px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        border: "none",
        boxShadow: "0 2px 4px rgba(5, 150, 105, 0.2)",
    },
    danger: {
        ...base,
        backgroundColor: "#dc2626",
        color: "#ffffff",
        paddingTop: "12px",
        paddingRight: "24px",
        paddingBottom: "12px",
        paddingLeft: "24px",
        border: "none",
        boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
    },
    compact: {
        ...base,
        backgroundColor: "#6692b3",
        color: "#ffffff",
        paddingTop: "8px",
        paddingRight: "16px",
        paddingBottom: "8px",
        paddingLeft: "16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "500",
        marginTop: "10px",
        marginRight: "10px",
        marginBottom: "15px",
    },
    pill: {
        ...base,
        backgroundColor: "#6692b3",
        color: "#ffffff",
        paddingTop: "14px",
        paddingRight: "32px",
        paddingBottom: "14px",
        paddingLeft: "32px",
        borderRadius: "50px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        boxShadow: "0 4px 12px rgba(102, 146, 179, 0.3)",
    }
};
