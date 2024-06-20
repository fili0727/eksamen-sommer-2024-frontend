
import './styling/app.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Test from './testPage/Test';
import Layout from './Layout';
import Deltagere from '../src/pages/deltagere/Deltagere';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<Test />} />
        <Route path="/deltagere" element={<Deltagere />} />
      </Routes>
    </Layout>
  );
}
