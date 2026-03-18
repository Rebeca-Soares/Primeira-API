import * as userService from "../services/userService.js";

export const checkUserExists = (req, res, next) => {
    const userId = req.params.id;   
    const user = userService.findUserById(userId);
    
    if (!user) {
        return res.status(404).json({ error: "Utilizador não encontrado" });
    }
    
    req.user = user;
    next();
};