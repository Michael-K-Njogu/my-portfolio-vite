import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ExclamationDiamond } from 'react-bootstrap-icons'

export default function NotFound() {

    useEffect(() => {
        document.title = "Error 404 - Page Not Found"
    }, [])    

    return (
        <div className="wrapper">  
            <section className="hero">
                <Container>
                    <div className="icon-wrapper mb-4">
                        <ExclamationDiamond size={64} />
                    </div>
                    <h1 className="mb-4">Page Not Found</h1>
                    <p>It seems like the page or case study you are looking for does not exist on this site, or may have been permanently deleted.</p>
                    <Link className="styled-link styled-link-full" to="/" title="Go back to the homepage">Take me back home</Link>
                </Container>
            </section>              
        </div>
    )
}