export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          nome: string
          email: string
          perfil: "admin" | "comum"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          email: string
          perfil?: "admin" | "comum"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          email?: string
          perfil?: "admin" | "comum"
          updated_at?: string
        }
      }
      tecnicos: {
        Row: {
          id: string
          nome: string
          registro_profissional: string
          telefone: string
          email: string
          especialidade: string
          status: "ativo" | "inativo" | "ferias" | "em_campo"
          localizacao: string
          data_cadastro: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          registro_profissional: string
          telefone: string
          email: string
          especialidade: string
          status?: "ativo" | "inativo" | "ferias" | "em_campo"
          localizacao: string
          data_cadastro?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          registro_profissional?: string
          telefone?: string
          email?: string
          especialidade?: string
          status?: "ativo" | "inativo" | "ferias" | "em_campo"
          localizacao?: string
          updated_at?: string
        }
      }
      processos: {
        Row: {
          id: string
          numero_processo: string
          data_protocolo: string
          tipo_servico: "SIMCAR" | "CC-SEMA" | "DAAP" | "DLA" | "PEF" | "Georreferenciamento"
          titulo: string
          cliente: string
          status: "em_andamento" | "finalizado" | "aguardando" | "vencido" | "documentacao" | "aprovado"
          prioridade: "alta" | "media" | "baixa"
          data_expiracao: string
          tecnico_id: string
          descricao?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numero_processo: string
          data_protocolo: string
          tipo_servico: "SIMCAR" | "CC-SEMA" | "DAAP" | "DLA" | "PEF" | "Georreferenciamento"
          titulo: string
          cliente: string
          status?: "em_andamento" | "finalizado" | "aguardando" | "vencido" | "documentacao" | "aprovado"
          prioridade?: "alta" | "media" | "baixa"
          data_expiracao: string
          tecnico_id: string
          descricao?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numero_processo?: string
          data_protocolo?: string
          tipo_servico?: "SIMCAR" | "CC-SEMA" | "DAAP" | "DLA" | "PEF" | "Georreferenciamento"
          titulo?: string
          cliente?: string
          status?: "em_andamento" | "finalizado" | "aguardando" | "vencido" | "documentacao" | "aprovado"
          prioridade?: "alta" | "media" | "baixa"
          data_expiracao?: string
          tecnico_id?: string
          descricao?: string
          updated_at?: string
        }
      }
      documentos: {
        Row: {
          id: string
          nome_arquivo: string
          tipo: "PDF" | "JPEG"
          tamanho: number
          data_upload: string
          processo_id: string
          url_arquivo: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome_arquivo: string
          tipo: "PDF" | "JPEG"
          tamanho: number
          data_upload?: string
          processo_id: string
          url_arquivo: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome_arquivo?: string
          tipo?: "PDF" | "JPEG"
          tamanho?: number
          processo_id?: string
          url_arquivo?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Usuario = Database["public"]["Tables"]["usuarios"]["Row"]
export type Tecnico = Database["public"]["Tables"]["tecnicos"]["Row"]
export type Processo = Database["public"]["Tables"]["processos"]["Row"]
export type Documento = Database["public"]["Tables"]["documentos"]["Row"]

export type ProcessoWithTecnico = Processo & {
  tecnicos: Tecnico
}

export type DocumentoWithProcesso = Documento & {
  processos: Processo
}
