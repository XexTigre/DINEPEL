"""Rebuild the synthetic catalog and inline prototype seed. No operational data."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
brands = [{"id": "marca-alfa", "name": "Alfa (demo)"}, {"id": "marca-beta", "name": "Beta (demo)"}, {"id": "marca-gama", "name": "Gama (demo)"}]
rows = [
    ("peca-demo-001", "marca-alfa", "PL-100", "Suporte do conjunto", "UN", "revisado"),
    ("peca-demo-002", "marca-beta", "PL-100", "Suporte de fixação", "UN", "pendente"),
    ("peca-demo-003", "marca-alfa", "RE-020", "Reservatório auxiliar", "PC", "pendente"),
    ("peca-demo-004", "marca-gama", "CO-030", "Conector do circuito", "UN", "revisado"),
    ("peca-demo-005", "marca-beta", "BU-040", "Bucha de apoio", "UN", "pendente"),
    ("peca-demo-006", "marca-gama", "KT-050", "Kit de reparo", "KT", "pendente"),
    ("peca-demo-007", "marca-alfa", "VA-060", "Válvula auxiliar", "UN", "pendente"),
]
products = [dict(zip(["id", "brand_id", "code", "name", "unit", "status"], row), source="Exemplo sintético DINEPEL v0.1") for row in rows]
catalog = {"schema_version": 1, "kind": "catalogo", "synthetic": True, "brands": brands, "products": products}
companies = [{"id": "empresa-demo-a", "name": "Empresa Exemplo A", "cnpj": ""}, {"id": "empresa-demo-b", "name": "Empresa Exemplo B", "cnpj": ""}]
branches = [{"id": f"filial-a-{i}", "company_id": "empresa-demo-a", "name": name, "type": "Matriz informada" if i == 1 else "Filial informada"} for i, name in enumerate(["Unidade principal", "Unidade norte", "Unidade sul", "Unidade leste"], 1)]
branches.append({"id": "filial-b-1", "company_id": "empresa-demo-b", "name": "Unidade principal B", "type": "Matriz informada"})
links = [{"id": f"vinculo-a-{i}", "company_id": "empresa-demo-a", "product_id": products[i-1]["id"], "internal_code": f"A-00{i}", "namespace": "Sistema demonstração"} for i in [1, 3, 4]]
links.append({"id": "vinculo-b-1", "company_id": "empresa-demo-b", "product_id": products[0]["id"], "internal_code": "B-081", "namespace": "Cadastro local"})
stock = []
for link, quantities in zip(links[:3], [[4, 2, 0, 3], [1, 0, 2, 1], [3, -1, 0, 2]]):
    stock.extend({"id": f"snap-{link['id']}-{i}", "link_id": link["id"], "branch_id": f"filial-a-{i}", "quantity": quantity, "at": "2026-10-18T12:00:00Z"} for i, quantity in enumerate(quantities, 1))
stock.append({"id": "snap-b-1", "link_id": "vinculo-b-1", "branch_id": "filial-b-1", "quantity": 7, "at": "2026-10-18T12:00:00Z"})
seed = {**catalog, "kind": "workspace", "products": products[:6], "companies": companies, "branches": branches, "links": links, "stock": stock, "events": [{"id": "evento-demo-1", "at": "2026-10-18T12:00:00Z", "action": "Base de demonstração iniciada", "description": "Marcas, peças, empresas e saldos são inteiramente fictícios. Nenhuma base operacional foi utilizada.", "company_id": None}]}
(root / "examples/catalogo-demo.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+"\n")
(root / "examples/workspace-demo.json").write_text(json.dumps(seed, ensure_ascii=False, indent=2)+"\n")
page = root / "prototype/index.html"
html = page.read_text()
if "__SEED_JSON__" in html:
    html = html.replace("__SEED_JSON__", json.dumps(seed, ensure_ascii=False).replace("</", "<\\/"))
else:
    start = html.index("const SEED=") + len("const SEED=")
    end = html.index(";\nconst KEY=", start)
    html = html[:start] + json.dumps(seed, ensure_ascii=False).replace("</", "<\\/") + html[end:]
page.write_text(html)
print("Synthetic catalog and prototype seed rebuilt.")
