using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProAtividade.Domain.Entities;
using ProAtividade.Domain.Interfaces.Repositories;
using ProAtividade.Domain.Interfaces.Services;

namespace ProAtividade.Domain.Services
{
    public class AtividadeService : IAtividadeService
    {
        private readonly IAtividadeRepository _atividadeRepository;
        public AtividadeService(IAtividadeRepository atividadeRepository)
        {
            _atividadeRepository = atividadeRepository;
            
        }
        public async Task<Atividade> AdicionarAtividade(Atividade model)
        {
            if(await _atividadeRepository.PegaPorTituloAsync(model.Titulo) != null)
                throw new Exception("Já existe uma atividade com esse título");

            if(await _atividadeRepository.PegaPorIdAsync(model.Id) == null)
            {
                _atividadeRepository.Adicionar(model);
                if(await _atividadeRepository.SalvarMudancasAsync())
                    return model;
            }

            return null;
        }

        public async Task<Atividade> AtualizarAtividade(Atividade model)
        {
            if(model.DataConclusao != null)
                throw new Exception("Não se pode alterar atividade já conluída");

            if(await _atividadeRepository.PegaPorIdAsync(model.Id) != null)
            {
                _atividadeRepository.Atualizar(model);
                if(await _atividadeRepository.SalvarMudancasAsync())
                    return model;
            }

            return null;
        }

        public async Task<bool> ConcluirAtividade(Atividade model)
        {
           if(model != null)
           {
               model.Concluir();
               _atividadeRepository.Atualizar<Atividade>(model);
               return await _atividadeRepository.SalvarMudancasAsync();
           }

           return false;
        }

        public async Task<bool> DeletarAtividade(int atividadeId)
        {
            var atividade = await _atividadeRepository.PegaPorIdAsync(atividadeId);
            if(atividade == null) throw new Exception("Atividade que tentou deletar não existe");

            _atividadeRepository.Deletar(atividade);
            return await _atividadeRepository.SalvarMudancasAsync();

        }

        public async Task<Atividade> PegarAtividadePorIdAsync(int atividadeId)
        {
            try
            {
                var atividade = await _atividadeRepository.PegaPorIdAsync(atividadeId);
                if(atividade == null) return null;

                return atividade;
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Atividade[]> PegarTodasAtividadesAsync()
        {
            try
            {
                var atividades = await _atividadeRepository.PegaTodasAsync();
                if(atividades == null) return null;

                return atividades;
            }
            catch (System.Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}