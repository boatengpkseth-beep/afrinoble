import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Craftsmanship from './pages/Craftsmanship'
import FabricDetail from './pages/FabricDetail'
import Artisans from './pages/Artisans'
import ArtisanDetail from './pages/ArtisanDetail'
import Journal from './pages/Journal'
import ArticleDetail from './pages/ArticleDetail'
import Lookbook from './pages/Lookbook'
import LookbookDetail from './pages/LookbookDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:slug" element={<CollectionDetail />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/craftsmanship" element={<Craftsmanship />} />
        <Route path="/craftsmanship/:slug" element={<FabricDetail />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:slug" element={<ArtisanDetail />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:slug" element={<ArticleDetail />} />
        <Route path="/lookbook" element={<Lookbook />} />
        <Route path="/lookbook/:slug" element={<LookbookDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
