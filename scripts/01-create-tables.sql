-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    perfil VARCHAR(20) DEFAULT 'comum' CHECK (perfil IN ('admin', 'comum')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tecnicos table
CREATE TABLE IF NOT EXISTS tecnicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    registro_profissional VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'ferias', 'em_campo')),
    localizacao VARCHAR(255) NOT NULL,
    data_cadastro DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create processos table
CREATE TABLE IF NOT EXISTS processos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    numero_processo VARCHAR(100) UNIQUE NOT NULL,
    data_protocolo DATE NOT NULL,
    tipo_servico VARCHAR(50) NOT NULL CHECK (tipo_servico IN ('SIMCAR', 'CC-SEMA', 'DAAP', 'DLA', 'PEF', 'Georreferenciamento', 'PRA', 'Laudos')),
    titulo VARCHAR(500) NOT NULL,
    cliente VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'finalizado', 'aguardando', 'vencido', 'documentacao', 'aprovado')),
    prioridade VARCHAR(10) DEFAULT 'media' CHECK (prioridade IN ('alta', 'media', 'baixa')),
    data_expiracao DATE NOT NULL,
    tecnico_id UUID NOT NULL REFERENCES tecnicos(id) ON DELETE RESTRICT,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documentos table
CREATE TABLE IF NOT EXISTS documentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('PDF', 'JPEG')),
    tamanho BIGINT NOT NULL,
    data_upload DATE DEFAULT CURRENT_DATE,
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    url_arquivo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_processos_tecnico_id ON processos(tecnico_id);
CREATE INDEX IF NOT EXISTS idx_processos_status ON processos(status);
CREATE INDEX IF NOT EXISTS idx_processos_tipo_servico ON processos(tipo_servico);
CREATE INDEX IF NOT EXISTS idx_documentos_processo_id ON documentos(processo_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_tecnicos_email ON tecnicos(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tecnicos_updated_at BEFORE UPDATE ON tecnicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processos_updated_at BEFORE UPDATE ON processos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documentos_updated_at BEFORE UPDATE ON documentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE tecnicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Usuarios: Users can only see their own data, admins can see all
CREATE POLICY "Users can view own profile" ON usuarios FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Admins can view all users" ON usuarios FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id::text = auth.uid()::text AND perfil = 'admin'
    )
);

-- Tecnicos: All authenticated users can view, only admins can modify
CREATE POLICY "Authenticated users can view tecnicos" ON tecnicos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage tecnicos" ON tecnicos FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id::text = auth.uid()::text AND perfil = 'admin'
    )
);

-- Processos: All authenticated users can view, only admins can modify
CREATE POLICY "Authenticated users can view processos" ON processos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage processos" ON processos FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id::text = auth.uid()::text AND perfil = 'admin'
    )
);

-- Documentos: All authenticated users can view, only admins can modify
CREATE POLICY "Authenticated users can view documentos" ON documentos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage documentos" ON documentos FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE id::text = auth.uid()::text AND perfil = 'admin'
    )
);
