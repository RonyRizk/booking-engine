import { Text } from '@react-email/components'
import React from 'react'
/**
 * EmailText component is a styled wrapper around the React Email <Text> component.
 * 
 * Props:
 * - color: Controls the text color. Accepts:
 *   - "red"    → renders dark red (#c62828)
 *   - any other value (including "default") → renders dark gray (#333333)
 * 
 * - variant: Controls the text style. Accepts:
 *   - "text"     → standard paragraph text
 *   - "title"    → bold, large title
 *   - "subtitle" → medium-sized subtitle with spacing
 *   - "property" → large title with big margin bottom
 * Any additional props are forwarded to the <Text> component.
 */
export default function EmailText({ color = "default", variant = "text", style, ...props }) {
    return (
        <Text {...props} style={{
            ...styles.base,
            ...styles[variant] ?? styles["text"],
            color: color === "red" ? "#c62828" : "#333333",
            ...style
        }} />
    )
}
const styles = {
    "base": {
        marginTop: '0',
        marginRight: '0',
        marginBottom: '10px',
        marginLeft: '0',

        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0',
    },
    "text": {
        fontSize: "14px",
        lineHeight: '1.4',
    },
    "title": {
        fontSize: "20px",
        fontWeight: 'bold',
    },
    "subtitle": {
        marginTop: '20px',
        fontSize: '20px',
    },
    "property": {
        color: '#555555',
        fontSize: '17px',
        marginBottom: '30px',
    }
}
