const Spacecraft = require("../models/spacecraft");
const { Op } = require("sequelize");
const Astronaut = require("../models/astronaut");

const router = require("express").Router();

router
    .route("/spacecrafts")
    .get(async(req, res) => {
        try {
            const { filterNume } = req.query;
            const { filterViteza } = req.query;
            const { sortBy } = req.query;
            if (filterNume && filterViteza) {
                const spacecrafts = await Spacecraft.findAll({
                    where: {
                        nume: {
                            [Op.eq]: filterNume
                        },
                        viteza: {
                            [Op.eq]: filterViteza
                        }
                    },
                    attributes: ["id", "nume", "viteza", "masa"],
                    order: sortBy ? [
                        [sortBy, "ASC"]
                    ] : undefined
                });
                return res.status(200).json(spacecrafts);
            } else {
                const spacecrafts = await Spacecraft.findAll();
                return res.status(200).json(spacecrafts);
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })
    .post(async(req, res) => {
        try {
            if (req.body.nume.length >= 3 && req.body.viteza > 1000 && req.body.masa > 200) {
                const newSpacecraft = await Spacecraft.create(req.body);
                return res.status(200).json(newSpacecraft);
            } else {
                return res.status(500).json({ mes: "Date incorecte!" });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })

router
    .route("/spacecrafts/:id")
    .get(async(req, res) => {
        try {
            const spacecraft = await Spacecraft.findByPk(req.params.id);
            if (spacecraft) {
                return res.status(200).json(spacecraft);
            } else {
                return res.status(404).json({ error: `Spacecraft with id ${req.params.id} not found!` });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })
    .put(async(req, res) => {
        try {
            const spacecraft = await Spacecraft.findByPk(req.params.id);
            if (req.body.nume.length >= 3 && req.body.viteza > 1000 && req.body.masa > 200) {
                if (spacecraft) {
                    const updateSpacecraft = await spacecraft.update(req.body);
                    return res.status(200).json(updateSpacecraft);
                } else {
                    return res.status(404).json({ error: `Spacecraft with id ${req.params.id} not found!` });
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
            const spacecraft = await Spacecraft.findByPk(req.params.id);
            if (spacecraft) {
                const deleteSpacecraft = await spacecraft.destroy();
                return res.status(200).json(deleteSpacecraft);
            } else {
                return res.status(404).json({ error: `Spacecraft with id ${req.params.id} not found!` });
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    })
    // import
router
    .route("/import")
    .post(async(req, res, next) => {
        try {
            for (let j of req.body) {
                const spacecraft = await Spacecraft.create(j);
                for (let c of j.astronauts) {
                    const astronaut = await Spacecraft.create(c);
                    spacecraft.addAstronaut(astronaut);
                }
                await spacecraft.save();
            }
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    })

// export
router
    .route("/export")
    .get(async(req, res, next) => {
        try {
            let exp = [];
            const spacecrafts = await Spacecraft.findAll();
            for (let j of spacecrafts) {
                const spacecraft = {
                    nume: j.nume,
                    viteza: j.viteza,
                    masa: j.masa,
                    Astronauts: []
                }

                for (let c of await j.getAstronauts()) {
                    spacecraft.Astronauts.push({
                        nume: c.nume,
                        rol: c.rol
                    });
                }
                exp.push(spacecraft);
            }
            if (exp.length > 0) {
                res.json({ export: exp });
            } else {
                res.sendStatus(204);
            }
        } catch (err) {
            next(err);
        }
    })
module.exports = router;