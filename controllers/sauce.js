const Sauce = require('../models/Sauce');

const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })

};



exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
        .catch(error => res.status(401).json({ error }));
}



exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'sauce supprimé !' }) })
                    .catch(error => res.status(401).json({ error }));
            });
        })

        .catch(error =>
            res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {

    console.log(req.body.like);
    console.log(req.params.id);

    let like = req.body.like;// recupere la donnée de like 
    const userId = req.body.userId; // recupere la donnée userId 
    const id = req.params.id // recupere l'idée 

    if (like === 1) {
        // si like = 1 alors mise à jour de la sauce par son ID , incrémentation de 1 avec $inc et pousse dans le tableau l'utilisateur qui à liker 
        Sauce.updateOne({ _id: id }, { $inc: { likes: 1 }, $push: { usersLiked: userId } })
            .then((sauce) => res.status(200).json({ message: 'Like' }))
            .catch(error => res.status(400).json({ error }))

    } else if (like === -1) {
        // si like = -1 alors meme chose de que like 
        Sauce.updateOne({ _id: id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike' }))
            .catch(error => res.status(400).json({ error }))
    } else {

        Sauce.findOne({ _id: id })
            .then(sauce => {

                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: id }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                        .then((sauce) => res.status(200).json({ message: 'Dislike' }))
                        .catch(error => res.status(400).json({ error }))

                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
                        .then((sauce) => res.status(200).json({ message: 'Dislike' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error =>
                res.status(500).json({ error }));
    }
};





