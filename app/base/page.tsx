import { promises as fs } from "fs"
import path from "path"

export default async function BaseDocPage() {
  const filePath = path.join(process.cwd(), "BASE_DO_PROJETO.md")
  let content = ""

  try {
    content = await fs.readFile(filePath, "utf8")
  } catch (e) {
    content = "BASE_DO_PROJETO.md não encontrado no repositório. Verifique se o arquivo existe na raiz do projeto."
  }

  return (
    <div className="min-h-screen w-full flex items-start justify-center p-6">
      <div className="w-full max-w-4xl bg-card border rounded-lg p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Documentação Base do Projeto</h1>
          <a
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
          >
            Voltar ao app
          </a>
        </div>
        <pre className="whitespace-pre-wrap text-sm leading-6">{content}</pre>
      </div>
    </div>
  )
}