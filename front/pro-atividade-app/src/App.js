import { useState, useEffect } from 'react';
import './App.css';
import {Button, Modal} from 'react-bootstrap';
import api from './api/atividade';
import AtividadeLista from './pages/atividades/AtividadeLista';
import AtividadeForm from './pages/atividades/AtividadeForm';
import TitlePage from './components/TitlePage';

function App() {
  const [showAtividadeModal, setShowAtividadeModal] = useState(false);
  const [smShowConfirmeModal, setSmShowConfirmeModal] = useState(false);
  const [atividades, setAtividades] = useState([]);
  const [atividade, setAtividade] = useState({id: 0});

  const handleAtividadeModal = () => 
    setShowAtividadeModal(!showAtividadeModal);
    
  const handleConfirmeModal = (id) => {
    if(id !== 0 && id !== undefined){
      const atividade = atividades.filter((atividade) => atividade.id === id);
      setAtividade(atividade[0]);
    }else {
      setAtividade({id: 0});
    }
    setSmShowConfirmeModal(!smShowConfirmeModal);
  }


  const pegaTodasAtividades = async () => {
    const response = await api.get('atividade');
    return response.data;
  }

  const novaAtividade = () => {
    setAtividade({id: 0});
    handleAtividadeModal();
  }
  useEffect(() => {
    const getAtividades = async () => {
      const todasAtividades = await pegaTodasAtividades();
      if(todasAtividades) setAtividades(todasAtividades);
    };
    getAtividades();
  }, [])

  const addAtividade = async (ativ) =>{
    handleAtividadeModal();
    const response = await api.post('atividade', ativ);
    setAtividades([...atividades, 
      response.data]);
  }

  const cancelarAtividade= () => {
    setAtividade({id: 0});
    handleAtividadeModal();
  }

  const atualizarAtividade = async (ativ) => {
    handleAtividadeModal();
    const response = await api.put(`atividade/${ativ.id}`, ativ);
    const { id } = response.data;

    setAtividades(
      atividades.map((item) => (item.id === id ? response.data : item))
    );
    setAtividade({id:0});
  }

  const deletarAtividade = async (id) => {
    handleConfirmeModal(0);
    if(await api.delete(`atividade/${id}`)){
      const atividadesFiltradas = atividades.filter(atividade => atividade.id !== id);
      setAtividades([...atividadesFiltradas]);
    }
  }

  const pegarAtividade = (id) => {
    const atividade = atividades.filter((atividade) => atividade.id === id);
    setAtividade(atividade[0]);
    handleAtividadeModal();
  }
  

  return (
    <>
    <TitlePage title={'Atividade ' + (atividade.id !== 0 ? atividade.id : "")}>
    <Button variant="outline-secondary" onClick={novaAtividade}>
          <i className="fas fa-plus"></i>
        </Button>
      </TitlePage>
      

      <AtividadeLista
        atividades={atividades}
        pegarAtividade={pegarAtividade}
        handleConfirmeModal={handleConfirmeModal}
      />

      <Modal show={showAtividadeModal} onHide={handleAtividadeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Atividade {atividade.id !== 0 ? atividade.id : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AtividadeForm
            addAtividade={addAtividade}
            atualizarAtividade={atualizarAtividade}
            cancelarAtividade={cancelarAtividade}
            ativSelecionada={atividade}
            atividades={atividades}
          />
        </Modal.Body>
      </Modal>

      <Modal size="sm" show={smShowConfirmeModal} onHide={handleConfirmeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Excluindo Atividade {atividade.id !== 0 ? atividade.id : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja Excluir a Atividade {atividade.id}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <button
            className="btn btn-outline-success me-2"
            onClick={() => deletarAtividade(atividade.id)}
          >
            <i className="fas fa-check me-2"></i>
            Sim
          </button>
          <button
            className="btn btn-danger me-2"
            onClick={() => handleConfirmeModal(0)}
          >
            <i className="fas fa-times me-2"></i>
            Não
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
