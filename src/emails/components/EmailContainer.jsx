import { Body, Container, Head, Html, Link, Text } from '@react-email/components'


export default function EmailContainer({ style, lang, ...props }) {
    return (
        <Html dir={lang === "ar" ? "rtl" : "ltr"}>
            <Head>
                <style>
                    {`
                        .email-container {
                            padding: 10px !important;
                        }
                            
                        @media screen and (min-width: 600px) {
                            .email-container {
                                padding: 20px !important;
                            }
                        }
                    `}
                </style>
            </Head>
            <Body {...props} style={{ ...styles.body, ...style }}>
                <Container style={styles.container}>
                    <div style={styles.content} className='email-container'>
                        {props.children}
                    </div>
                    <div style={styles.footer}>
                        <Link style={styles.footerLink} href="https://info.igloorooms.com">
                            <Text style={styles.footerText}>
                                © {new Date().getFullYear()} igloorooms LLC
                            </Text>
                        </Link>
                    </div>
                </Container>
            </Body>
        </Html>
    )
}

const styles = {
    body: {
        fontFamily: "BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        backgroundColor: "#ffffff",
        padding: "0",
        margin: "0",
        width: "100%",
    },
    container: {
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
    },
    content: {
        // padding: "20px",
        // minHeight: "550px",
    },
    footer: {
        backgroundColor: "#f8f9fa",
        padding: "0",
        margin: "0",
        // marginTop: "50px",
    },
    footerLink: {
        textDecoration: "none",
        display: "block",
        width: "100%",
        boxSizing: "border-box",
    },
    footerText: {
        fontSize: "13px",
        color: "#6b7280",
        backgroundColor: "transparent",
        padding: "10px 10px 20px 10px",
        margin: "0",
        textAlign: "center",
        lineHeight: "1.5",
        boxSizing: "border-box",
    }
}
