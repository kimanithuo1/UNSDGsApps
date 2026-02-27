import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-accent">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
