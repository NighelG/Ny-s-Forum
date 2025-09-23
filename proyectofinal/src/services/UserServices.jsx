/* GET */
async function getUsers() {
    try {
        const response = await fetch('http://localhost:3001/users', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al obtener los usuarios", error);
        throw error;
    }
}

/* POST */
async function postUser(userObj) {
    try {
        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userObj)
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al registrar el usuario", error);
        throw error;
    }
}

/* PATCH */
async function patchUser(id, data) {
    try {
        const response = await fetch('http://localhost:3001/users/'+id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al actualizar el usuario", error);
        throw error;
    }
}

/* DELETE */
async function deleteUser(id) {
    try {
        const response = await fetch('http://localhost:3001/users/'+id, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error("ERROR al eliminar el usuario", error);
        throw error;
    }
}

export default { getUsers, postUser, patchUser, deleteUser };