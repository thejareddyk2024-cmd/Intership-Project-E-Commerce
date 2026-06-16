function Footer() {
    return (
        <footer className="py-5 mt-auto glass-card mx-3 mb-3 border-0">
            <div className="container">
                <div className="row g-4 justify-content-between align-items-center">
                    <div className="col-lg-4 text-center text-lg-start">
                        <span className="fw-800 gradient-text fs-4 mb-2 d-block">ShopSmart-AI</span>
                        <p className="text-white-50 small mb-0">
                            Pioneering the future of intelligent e-commerce. Built with passion for the next generation of tech enthusiasts.
                        </p>
                    </div>
                    <div className="col-lg-auto">
                        <div className="d-flex justify-content-center gap-4">
                            <a href="#" className="text-white-50 small text-decoration-none hover-white">Privacy Policy</a>
                            <a href="#" className="text-white-50 small text-decoration-none hover-white">Terms of Service</a>
                            <a href="#" className="text-white-50 small text-decoration-none hover-white">Support Center</a>
                        </div>
                    </div>
                    <div className="col-lg-auto text-center text-lg-end">
                        <span className="text-white-50 small">© 2026 ShopSmart-AI. Powered by FutureTech.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;