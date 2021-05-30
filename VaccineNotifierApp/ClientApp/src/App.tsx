import './App.css';
import SlotNotifierBuilder from './containers/SlotNotifierBuilder';
import { Layout } from './layout/Layout';

function App() {
  return (
    <div className="App">
     <Layout>
     <SlotNotifierBuilder/>
    </Layout>
    </div>
  );
}

export default App;
