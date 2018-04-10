const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    User.find()
      .populate("userTasks")
      .exec()
      .then(docs => {
        // console.log({ docs });
        const response = docs.map(doc => {
          // console.log({ nam: doc.userTasks });

          users: return {
            id: doc._id,
            name: doc.name,
            cpf: doc.cpf,
            age: doc.age,
            tasks: doc.userTasks.map(task => {
              return {
                name: task.name
              };
            })
          };
        });
        res.send({
          response: {
            message: "Data load successfull",
            content: { users: response }
          }
        });
      });
  } catch (error) {
    console.log({ error });
    return res.status(500).send({ response: error });
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    //   usando o await para fazer com que o restante deste bloco de codigo espere a busca pelo usuário temrinar para continuar sua execução
    const user = await User.findById(req.params.userId).populate("userTasks");
    // formatando a mensagem de resposta
    const response = {
      id: user._id,
      name: user.name,
      cpf: user.cpf,
      age: user.age,
      tasks: user.userTasks.map(task => {
        return {
          name: task.name
        };
      })
    };
    return res.status(200).send({
      response: { message: "User load successfull.", content: response }
    });
  } catch (error) {
    // console.log(error);
    // retorna not found(não econtrado ) caso o usuário não ser achado na base dde dados
    res.status(404).send({ response: { message: "User not found." } });
  }
  // return res.status(200).send({ response: "User " + req.params.userId });
});

router.post("/", async (req, res, next) => {
  const { name, age, cpf, tasks } = req.body;
  const user = await User.create({ name, age, cpf });
  console.log(user._id);

  await Promise.all(
    tasks.map(async task => {
      const userTask = await Task.create({ ...task, assignedTo: user._id });
      await userTask.save();
      user.userTasks.push(userTask);
    })
  );
  await user.save();
  const response = {
    id: user._id,
    name: user.name,
    cpf: user.cpf,
    age: user.age,
    tasks: user.userTasks.map(task => {
      return {
        name: task.name
      };
    })
  };

  res.send({
    response: { message: "User create successfull.", content: response }
  });
});

router.patch("/:userId", async (req, res, next) => {
  try {
    const { name, cpf, age, tasks } = req.body;
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          name,
          age,
          cpf
        },
        { new: true }
      );
      //   console.log({ user });
      if (!user)
        return res.status(404).send({
          response: { message: "User not found." }
        });
      await Task.remove({ assignedTo: req.params.userId });
      user.userTasks = [];
      await Promise.all(
        tasks.map(async task => {
          const userTask = new Task({
            ...task,
            assignedTo: req.params.userId
          });
          await userTask.save();
          user.userTasks.push(userTask);
        })
      );
      await user.save();
      console.log(user);

      let cont = 0;

      const response = {
        id: user._id,
        name: user.name,
        cpf: user.cpf,
        age: user.age,
        tasks: user.userTasks.map(task => {
          //   console.log(task);
          console.log(cont);
          cont++;

          return {
            name: task.name
          };
        })
      };
      return res.status(200).send({
        response: { message: "User update successfull.", content: response }
      });
    } catch (error) {
      console.log(error);

      return res.status(500).send({
        response: { message: "Internal error.Cannot update user. Try again." }
      });
    }

    // return res.status(200).send({ response: "User " + req.params.userId });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ response: { message: "Internal error. Try again." } });
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove(req.params.userId);
    if (!user) {
      return res.status(410).send({
        response: {
          message: "Cannot delete user, because he's gone."
        }
      });
    }
    const response = {
      message: "User delete successfull."
    };
    return res.status(202).send({ response: response });
  } catch (error) {
    return res.status(500).send({
      response: {
        message: "Internal error.Cannot delete user, please Try again."
      }
    });
  }
});

module.exports = app => app.use("/users", router);
