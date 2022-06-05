function deletarNota(id) {
    const confirmacao = confirm("Deseja excluir esta nota?");
    if (confirmacao) {
        window.location.href = `/notas/${id}/deletar`;
    }
}

function deletarCategoria(id) {
    const confirmacao = confirm("Deseja excluir esta categoria?");
    if (confirmacao) {
        window.location.href = `/categorias/${id}/deletar`;
    }
}

function deletarTags(id) {
    const confirmacao = confirm("Deseja excluir esta tag?");
    if (confirmacao) {
        window.location.href = `/tags/${id}/deletar`;
    }
}