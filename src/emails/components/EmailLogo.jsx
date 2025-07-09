const { Section, Img } = require("@react-email/components");
const EmailLogo = ({ src, alt, width = 180 }) => (
    <Section style={{ paddingTop: '10px', paddingBottom: '5px' }}>
        <Img
            src={src}
            alt={alt}
            // width={width}
            style={{ maxWidth: width, height: 'auto' }}
        />
    </Section>
);
export default EmailLogo
