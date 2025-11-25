import { Row, Col, Container } from 'react-bootstrap'
import { Linkedin, EnvelopeAt, Github } from 'react-bootstrap-icons'

let currentYear = new Date().getFullYear()

const Footer = () => {
        return (
            <footer>
                <Container>
                    <Row>
                        <Col md={6}>
                            <p>&copy; {currentYear} Michael Njogu. Made with <a href="https://www.contentful.com/" rel="nofollow noreferrer" target="_blank">Contentful</a> &amp; <a href="https://vite.dev/guide/" rel="nofollow noreferrer" target="_blank">React + Vite</a>.</p>
                        </Col>
                        <Col md={6}>
                            <ul className="social-icons">
                                <li><a href="https://www.linkedin.com/in/michael-njogu/" rel="nofollow noreferrer" target="_blank" title="Connect with me on LinkedIn"><Linkedin size={24} /></a></li>
                                <li>
                                    <a
                                        href="#email"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            const codes = [109, 121, 107, 101, 107, 117, 110, 121, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109]
                                            const email = String.fromCharCode(...codes)
                                            window.location.href = `mailto:${email}`
                                        }}
                                        title="Send me an email"
                                        aria-label="Send me an email"
                                    >
                                        <EnvelopeAt size={24} />
                                    </a>
                                </li>
                                <li><a href="https://github.com/Michael-K-Njogu" rel="nofollow noreferrer" target="_blank" title="View my GitHub profile"><Github size={24} /></a></li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </footer>
        )
}

export default Footer