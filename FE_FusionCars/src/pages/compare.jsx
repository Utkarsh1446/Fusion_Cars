import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarComparison from '../components/CarComparison';

/**
 * Car Comparison Page
 *
 * Premium feature for comparing cars side-by-side
 */

export default function ComparePage() {
  return (
    <>
      <Head>
        <title>Compare Cars - Fusion Cars</title>
        <meta
          name="description"
          content="Compare luxury cars side-by-side. Make an informed decision with detailed specifications and pricing."
        />
        <meta name="keywords" content="car comparison, compare cars, luxury cars" />
      </Head>

      <Navbar />

      <div className="min-h-screen bg-primary-black py-16">
        <CarComparison />
      </div>

      <Footer />
    </>
  );
}
