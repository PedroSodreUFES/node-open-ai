const produtos : {
    nome: string;
    estoque: number;
}[] = [
    { nome: "Feijão", estoque: 0},
    { nome: "Arroz", estoque: 0},
    { nome: "Batata", estoque: 0},
    { nome: "Alface", estoque: 0},
    { nome: "Carne", estoque: 0},
    { nome: "Cenoura", estoque: 0},
    { nome: "Pepino", estoque: 0},
    { nome: "Tomate", estoque: 0},
    { nome: "Café", estoque: 0},
    { nome: "Pão de sal", estoque: 0},
    { nome: "Biscoito", estoque: 0},
    { nome: "Banana", estoque: 0},
    { nome: "Maçã", estoque: 0},
    { nome: "Presunto", estoque: 0},
    { nome: "Queijo", estoque: 0},
    { nome: "Presunto", estoque: 0},
]

export const produtosEmEstoque = () => {
    return produtos.filter((produtos) => produtos.estoque > 0).map(p => p.nome)
}

export const produtosEmFalta = () => {
    return produtos.filter((produtos) => produtos.estoque === 0).map(p => p.nome)
}