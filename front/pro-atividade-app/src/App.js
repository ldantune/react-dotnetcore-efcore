import './App.css';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Atividade from "./pages/atividades/Atividade";
import Cliente from './pages/clientes/Cliente';

export default function App() {
  return (
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/atividades" component={Atividade} />
      <Route path="/clientes"  component={Cliente} />
    </Switch>
  );
}