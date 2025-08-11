-- Insert sample tecnicos
INSERT INTO tecnicos (nome, registro_profissional, telefone, email, especialidade, status, localizacao) VALUES
('Maria Santos', 'CRQ-123456', '(11) 99999-1234', 'maria.santos@ecoflow.com', 'SIMCAR', 'ativo', 'São Paulo, SP'),
('João Silva', 'CREA-789012', '(11) 99999-5678', 'joao.silva@ecoflow.com', 'PEF', 'ativo', 'Campinas, SP'),
('Ana Costa', 'CRQ-345678', '(11) 99999-9012', 'ana.costa@ecoflow.com', 'DAAP', 'ativo', 'Santos, SP'),
('Carlos Lima', 'CREA-901234', '(11) 99999-3456', 'carlos.lima@ecoflow.com', 'Georreferenciamento', 'em_campo', 'Ribeirão Preto, SP'),
('Lucia Ferreira', 'CRQ-567890', '(11) 99999-7890', 'lucia.ferreira@ecoflow.com', 'CC-SEMA', 'ferias', 'Sorocaba, SP');

-- Insert sample processos
INSERT INTO processos (numero_processo, data_protocolo, tipo_servico, titulo, cliente, status, prioridade, data_expiracao, tecnico_id, descricao) VALUES
('SIMCAR-2024-001', '2024-01-15', 'SIMCAR', 'Licenciamento Fazenda São João', 'Fazenda São João Ltda', 'em_andamento', 'alta', '2024-02-15', (SELECT id FROM tecnicos WHERE email = 'maria.santos@ecoflow.com'), 'Processo de licenciamento ambiental para atividades rurais'),
('PEF-2024-002', '2024-01-14', 'PEF', 'Plano de Exploração Florestal - Área 1', 'Madeireira Central', 'documentacao', 'media', '2024-02-20', (SELECT id FROM tecnicos WHERE email = 'joao.silva@ecoflow.com'), 'Elaboração de plano de exploração florestal sustentável'),
('DAAP-2024-003', '2024-01-13', 'DAAP', 'Declaração de Atividades Ambientais', 'Indústria Verde S.A.', 'aprovado', 'baixa', '2024-01-30', (SELECT id FROM tecnicos WHERE email = 'ana.costa@ecoflow.com'), 'Declaração anual de atividades com potencial poluidor'),
('GEO-2024-004', '2024-01-12', 'Georreferenciamento', 'Levantamento Topográfico - Lote 15', 'Cooperativa Rural', 'em_andamento', 'alta', '2024-02-10', (SELECT id FROM tecnicos WHERE email = 'carlos.lima@ecoflow.com'), 'Georreferenciamento de propriedade rural para regularização'),
('CC-SEMA-2024-005', '2024-01-11', 'CC-SEMA', 'Certidão de Conformidade Ambiental', 'Agropecuária Moderna', 'aguardando', 'media', '2024-02-25', (SELECT id FROM tecnicos WHERE email = 'lucia.ferreira@ecoflow.com'), 'Obtenção de certidão de conformidade ambiental'),
('PRA-2024-006', '2024-01-10', 'PRA', 'Plano de Recuperação de Área Degradada', 'Mineração Sul Ltda', 'em_andamento', 'alta', '2024-03-01', (SELECT id FROM tecnicos WHERE email = 'maria.santos@ecoflow.com'), 'Elaboração de plano para recuperação de área degradada por mineração'),
('LAUDOS-2024-007', '2024-01-09', 'Laudos', 'Laudo Técnico de Vegetação Nativa', 'Fazenda Esperança', 'finalizado', 'media', '2024-01-25', (SELECT id FROM tecnicos WHERE email = 'joao.silva@ecoflow.com'), 'Laudo técnico para identificação e avaliação de vegetação nativa');

-- Insert sample documentos
INSERT INTO documentos (nome_arquivo, tipo, tamanho, processo_id, url_arquivo) VALUES
('licenca_ambiental.pdf', 'PDF', 2048000, (SELECT id FROM processos WHERE numero_processo = 'SIMCAR-2024-001'), 'https://example.com/docs/licenca_ambiental.pdf'),
('planta_baixa.jpg', 'JPEG', 1536000, (SELECT id FROM processos WHERE numero_processo = 'PEF-2024-002'), 'https://example.com/docs/planta_baixa.jpg'),
('relatorio_tecnico.pdf', 'PDF', 3072000, (SELECT id FROM processos WHERE numero_processo = 'DAAP-2024-003'), 'https://example.com/docs/relatorio_tecnico.pdf'),
('mapa_topografico.pdf', 'PDF', 4096000, (SELECT id FROM processos WHERE numero_processo = 'GEO-2024-004'), 'https://example.com/docs/mapa_topografico.pdf'),
('certidao_anterior.pdf', 'PDF', 1024000, (SELECT id FROM processos WHERE numero_processo = 'CC-SEMA-2024-005'), 'https://example.com/docs/certidao_anterior.pdf');

-- Insert sample usuarios (these will be created via Supabase Auth, but we can create the profile records)
-- Note: In a real application, these would be created automatically when users sign up
INSERT INTO usuarios (id, nome, email, perfil) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Administrador Sistema', 'admin@ecoflow.com', 'admin'),
('550e8400-e29b-41d4-a716-446655440001', 'Usuário Comum', 'usuario@ecoflow.com', 'comum');
