const Astronaut = require("../models/astronaut");
const Spacecraft = require("../models/spacecraft");

const router = require("express").Router();

let roluri = ["COMMANDER", "PILOT"];

router
    .route("/astronauts")
    .get(async(req, res) => {
        try {
            const astronauts = await Astronaut.findAll();
            return res.status(200).json(astronauts);
        } catch (err) {
            return res.status(500).json(err);
        }
    })
    .post(async(req, res) => {
        try {
            if (roluri.indexOf(req.body.rol) >= 0 && req.body.nume.length >= 5) {
                const newAstronaut = await Astronaut.create(req.body);
                return res.status(200).json(newAstronaut);
            } else {
                return res.status(500).json({ mes: "Date incorecte!" });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })

router
    .route("/astronauts/:id")
    .get(async(req, res) => {
        try {
            const astronaut = await Astronaut.findByPk(req.params.id);
            if (astronaut) {
                return res.status(200).json(astronaut);
            } else {
                return res.status(404).json({ error: `Astronaut with id ${req.params.id} not found!` });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })
    .put(async(req, res) => {
        try {
            const astronaut = await Astronaut.findByPk(req.params.id);
            if (roluri.indexOf(req.body.rol) >= 0 && req.body.nume.length >= 5) {
                if (astronaut) {
                    const updateAstronaut = await astronaut.update(req.body);
                    return res.status(200).json(updateAstronaut);
                } else {
                    return res.status(404).json({ error: `Astronaut with id ${req.params.id} not found!` });
                }
            } else {
                return res.status(500).json({ mes: "Date incorecte!" });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })
    .delete(async(req, res) => {
        try {
            const astronaut = await Astronaut.findByPk(req.params.id);
            if (astronaut) {
                const deleteAstronaut = await astronaut.destroy();
                return res.status(200).json(deleteAstronaut);
            } else {
                return res.status(404).json({ error: `Astronaut with id ${req.params.id} not found!` });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })
    // Get si Post pentru entitatea copil
router
    .route("/spacecrafts/:spacecraftID/astronauts")
    .post(async(req, res, next) => {
        try {
            const spacecraft = await Spacecraft.findByPk(req.params.spacecraftID);
            if (roluri.indexOf(req.body.rol) >= 0 && req.body.nume.length >= 5) {
                if (spacecraft) {
                    const astronaut = new Astronaut(req.body);
                    astronaut.SpacecraftId = spacecraft.id;
                    await astronaut.save();
                    res.status(201).json({ message: "Astronaut created!" });
                } else {
                    res.status(404).json({ message: "404 - Spacecraft not found!" });
                }
            } else {
                return res.status(500).json({ mes: "Date incorecte!" });
            }
        } catch (err) {
            next(err);
        }
    })
    .get(async(req, res, next) => {
        try {
            const spacecraft = await Spacecraft.findByPk(req.params.spacecraftID, {
                include: [Astronaut]
            });
            if (spacecraft) {
                res.status(200).json(spacecraft.Astronauts);
            } else {
                res.status(404).json({ message: "404 - Spacecraft not found!" });
            }
        } catch (err) {
            next(err);
        }
    })

// Update si Delete entitate copil
router
    .route("/spacecrafts/:spacecraftID/astronauts/:astronautID")
    .put(async(req, res, next) => {
        try {
            const spacecraft = await Spacecraft.findByPk(req.params.spacecraftID);
            if (roluri.indexOf(req.body.rol) >= 0 && req.body.nume.length >= 5) {
                if (spacecraft) {
                    const astronauts = await spacecraft.getAstronauts({ id: req.params.astronautID });
                    astronaut = null;
                    for (c of astronauts) {
                        if (c.id == req.params.astronautID) {
                            astronaut = c;
                        }
                    }
                    if (astronaut) {
                        astronaut.nume = req.body.nume;
                        astronaut.rol = req.body.rol;
                        await astronaut.save();
                        res.status(202).json({ message: `Astronaut ${astronaut.id} updated!` });
                    } else {
                        res.status(404).json({ message: "404 - Astronaut not found!" });
                    }
                } else {
                    res.status(404).json({ message: "404 - Spacecraft not found!" });
                }
            } else {
                return res.status(500).json({ mes: "Date incorecte!" });
            }
        } catch (err) {
            next(err);
        }
    })
    .delete(async(req, res, next) => {
        try {
            const spacecraft = await Spacecraft.findByPk(req.params.spacecraftID);
            if (spacecraft) {
                const astronauts = await spacecraft.getAstronauts({ id: req.params.astronautID });
                astronaut = null;
                for (c of astronauts) {
                    if (c.id == req.params.astronautID) {
                        astronaut = c;
                    }
                }
                if (astronaut) {
                    await astronaut.destroy();
                    res.status(202).json({ message: "Astronaut deleted!" });
                } else {
                    res.status(404).json({ message: "404 - Astronaut not found!" });
                }
            } else {
                res.status(404).json({ message: "404 - Spacecraft not found!" });
            }
        } catch (err) {
            next(err);
        }
    })

module.exports = router;