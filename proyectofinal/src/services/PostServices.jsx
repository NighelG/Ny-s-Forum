/* GET */
async function getPosts() {
    try {
        const response = await fetch('http://localhost:3001/posts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al obtener los posts", error);
        throw error;
    }
}

/* POST */
async function postPost(postObj) {
    try {
        const response = await fetch('http://localhost:3001/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postObj)
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al crear el post", error);
        throw error;
    }
}

/* PATCH */
async function patchPost(id, data) {
    try {
        const response = await fetch('http://localhost:3001/posts'+id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al actualizar el post", error);
        throw error;
    }
}

/* DELETE */
async function deletePost(id) {
    try {
        const response = await fetch('http://localhost:3001/posts'+id, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al eliminar el post", error);
        throw error;
    }
}

export default { getPosts, postPost, patchPost, deletePost };