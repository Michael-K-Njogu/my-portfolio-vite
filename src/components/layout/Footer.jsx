import { Row, Col, Container } from 'react-bootstrap'
import { Linkedin, EnvelopeAt, Github } from 'react-bootstrap-icons'

let currentYear = new Date().getFullYear()

const Footer = () => {
        return (
            <footer>
                <Container>
                    <Row>
                        <Col md={6}>
                            <p>&copy; {currentYear} Michael Njogu. Made with <a href="https://www.contentful.com/" rel="nofollow noreferrer" target="_blank">Contentful</a> &amp; <a href="https://reactjs.org/" rel="nofollow noreferrer" target="_blank">React</a>.</p>
                        </Col>
                        <Col md={6}>
                            <ul className="social-icons">
                                <li><a href="https://www.linkedin.com/in/michael-njogu/" rel="nofollow noreferrer" target="_blank" title="Connect with me on LinkedIn"><Linkedin size={24} /></a></li>
                                <li><a href="mailto:mykekunyo@gmail.com" rel="nofollow noreferrer" title="Send me an email"><EnvelopeAt size={24} /></a></li>
                                <li><a href="https://github.com/Michael-K-Njogu" rel="nofollow noreferrer" target="_blank" title="View my GitHub profile"><Github size={24} /></a></li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </footer>
        )
}

export default Footer