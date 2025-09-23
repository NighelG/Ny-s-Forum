/* GET */
async function getComments() {
    try {
        const response = await fetch('http://localhost:3001/comments'+id, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al obtener los comentarios", error);
        throw error;
    }
}

/* POST */
async function postComment(commentObj) {
    try {
        const response = await fetch('http://localhost:3001/comments'+id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentObj)
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al crear el comentario", error);
        throw error;
    }
}

/* PATCH */
async function patchComment(id, data) {
    try {
        const response = await fetch('http://localhost:3001/comments'+id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al actualizar el comentario", error);
        throw error;
    }
}

/* DELETE */
async function deleteComment(id) {
    try {
        const response = await fetch('http://localhost:3001/comments'+id, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al eliminar el comentario", error);
        throw error;
    }
}

export default { getComments, postComment, patchComment, deleteComment };