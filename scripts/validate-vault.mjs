import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const errors = [];
const warnings = [];

const knowledgeRoots = [
  "10 - Estudos",
  "20 - Módulos SAP",
  "30 - Desenvolvimento",
  "40 - Guias",
  "50 - Referências",
];

const excludedDirectories = new Set([
  ".git",
  "node_modules",
  ".trash",
]);

const allowedTypes = new Set([
  "estudo",
  "modulo",
  "template-dev",
  "exemplo",
  "step-by-step",
  "troubleshooting",
  "referencia",
]);
const allowedStatuses = new Set(["rascunho", "validado", "desatualizado", "arquivado"]);
const allowedLevels = new Set(["basico", "intermediario", "avancado"]);
const requiredFields = [
  "id",
  "tipo",
  "status",
  "tecnologias",
  "modulos",
  "produtos",
  "release",
  "nivel",
  "autor",
  "criado",
  "atualizado",
  "fontes",
];

function toPosix(path) {
  return path.split(sep).join("/");
}

function walk(directory) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(fullPath));
    else result.push(fullPath);
  }
  return result;
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(content, file) {
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    errors.push(`${file}: frontmatter ausente.`);
    return null;
  }

  const closing = lines.slice(1).findIndex((line) => line.trim() === "---");
  if (closing < 0) {
    errors.push(`${file}: frontmatter não foi fechado.`);
    return null;
  }

  const data = {};
  for (const line of lines.slice(1, closing + 1)) {
    if (!line.trim() || /^\s/.test(line)) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = stripQuotes(match[2]);
  }
  return data;
}

function parseInlineArray(value) {
  if (typeof value !== "string" || !value.startsWith("[") || !value.endsWith("]")) return null;
  const body = value.slice(1, -1).trim();
  if (!body) return [];
  return body.split(",").map((item) => stripQuotes(item));
}

function isKnowledgeFile(file) {
  return knowledgeRoots.some((folder) => file === folder || file.startsWith(`${folder}/`));
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");
}

function validateKnowledgeFile(file, content, ids, titles) {
  const data = parseFrontmatter(content, file);
  if (!data) return;

  for (const field of requiredFields) {
    if (!(field in data) || data[field] === "") errors.push(`${file}: campo obrigatório '${field}' ausente.`);
  }

  if (data.id && !/^sap-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.id)) {
    errors.push(`${file}: id '${data.id}' não segue sap-<slug-estavel>.`);
  }
  if (data.id) {
    if (ids.has(data.id)) errors.push(`${file}: id duplicado '${data.id}', também usado em ${ids.get(data.id)}.`);
    else ids.set(data.id, file);
  }

  if (data.tipo && !allowedTypes.has(data.tipo)) errors.push(`${file}: tipo inválido '${data.tipo}'.`);
  if (data.status && !allowedStatuses.has(data.status)) errors.push(`${file}: status inválido '${data.status}'.`);
  if (data.nivel && !allowedLevels.has(data.nivel)) errors.push(`${file}: nível inválido '${data.nivel}'.`);
  if (!isDate(data.criado)) errors.push(`${file}: criado deve usar YYYY-MM-DD.`);
  if (!isDate(data.atualizado)) errors.push(`${file}: atualizado deve usar YYYY-MM-DD.`);

  for (const field of ["tecnologias", "modulos", "produtos", "fontes"]) {
    if (field in data && parseInlineArray(data[field]) === null) {
      errors.push(`${file}: '${field}' deve ser uma lista YAML inline, por exemplo [ABAP, RAP].`);
    }
  }

  if (data.status === "validado") {
    if (!data.validado_por) errors.push(`${file}: status validado exige 'validado_por'.`);
    if (!isDate(data.validado_em)) errors.push(`${file}: status validado exige 'validado_em' em YYYY-MM-DD.`);
    const section = content.match(/## Evidência de validação\s+([\s\S]*?)(?=\n## |$)/i)?.[1]?.trim();
    if (!section || /^preencher/i.test(section)) {
      errors.push(`${file}: status validado exige evidência de validação real.`);
    }
  }

  const name = basename(file, ".md");
  const titleKey = name.toLocaleLowerCase("pt-BR");
  if (titles.has(titleKey)) errors.push(`${file}: título duplicado, também usado em ${titles.get(titleKey)}.`);
  else titles.set(titleKey, file);

  if (/untitled/i.test(name)) errors.push(`${file}: nomes 'Untitled' são proibidos.`);
  if (/[a-f0-9]{24,}/i.test(name)) errors.push(`${file}: o nome parece conter hash de exportação.`);
  if (/\p{Extended_Pictographic}/u.test(name)) errors.push(`${file}: emojis decorativos não são permitidos no nome.`);

  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (!heading) errors.push(`${file}: título H1 ausente.`);
  else {
    const readableName = name.replace(/^\d+\s*-\s*/, "");
    if (heading !== name && heading !== readableName) {
      errors.push(`${file}: H1 '${heading}' deve corresponder ao nome '${name}'.`);
    }
  }
}

function validateSensitiveContent(file, content) {
  const patterns = [
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, "chave privada"],
    [/\bAKIA[0-9A-Z]{16}\b/, "chave de acesso AWS"],
    [/\bgh[pousr]_[A-Za-z0-9]{30,}\b/, "token GitHub"],
    [/\bsk-[A-Za-z0-9_-]{20,}\b/, "token de API"],
    [/(?:password|passwd|senha|token|secret)\s*[:=]\s*["']?[A-Za-z0-9/+_=.-]{12,}/i, "possível segredo atribuído"],
  ];

  for (const [pattern, label] of patterns) {
    if (pattern.test(content)) errors.push(`${file}: detectado ${label}; remova o valor antes de versionar.`);
  }
}

function buildLinkIndex(files) {
  const byBase = new Map();
  const byPath = new Set();
  for (const fullPath of files) {
    const rel = toPosix(relative(root, fullPath));
    byPath.add(rel.toLocaleLowerCase("pt-BR"));
    const extension = extname(rel);
    const stem = basename(rel, extension).toLocaleLowerCase("pt-BR");
    if (!byBase.has(stem)) byBase.set(stem, []);
    byBase.get(stem).push(rel);
  }
  return { byBase, byPath };
}

function linkExists(target, index) {
  const clean = target.split("|")[0].split("#")[0].trim().replace(/\\/g, "/");
  if (!clean) return true;
  const lower = clean.toLocaleLowerCase("pt-BR");
  const hasExtension = Boolean(extname(clean));

  if (clean.includes("/")) {
    if (index.byPath.has(lower)) return true;
    if (!hasExtension && index.byPath.has(`${lower}.md`)) return true;
    return false;
  }

  const stem = basename(clean, extname(clean)).toLocaleLowerCase("pt-BR");
  return index.byBase.has(stem);
}

function validateTrackedInbox() {
  try {
    const output = execFileSync("git", ["ls-files", "--", "00 - Entrada"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const tracked = output.split(/\r?\n/).filter(Boolean).filter((file) => file !== "00 - Entrada/README.md");
    for (const file of tracked) errors.push(`${file}: conteúdo bruto da Entrada não pode ser versionado.`);
  } catch {
    warnings.push("Git ainda não foi inicializado; verificação de arquivos versionados na Entrada foi ignorada.");
  }
}

if (!existsSync(join(root, "AGENTS.md")) || !existsSync(join(root, "99 - Sistema", "Taxonomia.md"))) {
  console.error("Execute a validação na raiz do SAP Knowledge Vault.");
  process.exit(1);
}

const allFiles = walk(root);
const markdownFiles = allFiles.filter((file) => extname(file).toLowerCase() === ".md");
const linkIndex = buildLinkIndex(allFiles);
const ids = new Map();
const titles = new Map();

for (const fullPath of markdownFiles) {
  const file = toPosix(relative(root, fullPath));
  const content = readFileSync(fullPath, "utf8");

  if (isKnowledgeFile(file)) validateKnowledgeFile(file, content, ids, titles);

  if (!file.startsWith("90 - Templates Obsidian/") && !file.startsWith("scripts/")) {
    validateSensitiveContent(file, content);
  }

  if (!file.startsWith("90 - Templates Obsidian/")) {
    for (const match of content.matchAll(/\[\[([^\]]+)\]\]/g)) {
      if (!linkExists(match[1], linkIndex)) errors.push(`${file}: link interno não resolvido '[[${match[1]}]]'.`);
    }
  }
}

const referencedNames = new Set();
for (const fullPath of markdownFiles) {
  const content = readFileSync(fullPath, "utf8");
  for (const match of content.matchAll(/\[\[([^\]]+)\]\]/g)) {
    const target = match[1].split("|")[0].split("#")[0].trim();
    if (target) referencedNames.add(basename(target, extname(target)).toLocaleLowerCase("pt-BR"));
  }
}

for (const fullPath of allFiles) {
  const file = toPosix(relative(root, fullPath));
  if (!file.startsWith("60 - Anexos/") || extname(file).toLowerCase() === ".md") continue;
  if (basename(file) === ".gitkeep") continue;
  const stem = basename(file, extname(file)).toLocaleLowerCase("pt-BR");
  if (!referencedNames.has(stem)) errors.push(`${file}: anexo órfão, sem wikilink em uma nota.`);
}

validateTrackedInbox();

for (const warning of warnings) console.warn(`AVISO: ${warning}`);
if (errors.length) {
  console.error(`\nValidação falhou com ${errors.length} erro(s):`);
  for (const error of errors.sort()) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validação concluída: ${markdownFiles.length} arquivos Markdown, ${ids.size} notas de conhecimento e nenhum erro.`);
