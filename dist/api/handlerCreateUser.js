import { createUser } from '../db/queries/users.js';
export async function handlerCreateUser(req, res) {
    const email = req.body.email;
    const user = await createUser({ email });
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(user);
    res.status(201).send(body);
}
