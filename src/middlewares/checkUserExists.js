import * as userService from "../services/userService.js";

export const checkUserExists = async (req, res, next) => {
    const userId = req.params.id;   
    const user = await userService.findUserById(userId);
    
    if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
    }
    
    req.user = user;
    next();
};

//await userService.findUserById(userId) para garantir que a função é resolvida antes de prosseguir.