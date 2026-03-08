import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Blog } from './pages/Blog';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="nosotros" element={<About />} />
          <Route path="blog" element={<Blog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
