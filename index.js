const Joi = require("joi");

const express = require("express");
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Define a sample array of LinkedIn test assessments
const assessments = [
  { id: 1, title: "Test 1", score: 10 },
  { id: 2, title: "Test 2", score: 15 },
  { id: 3, title: "Test 3", score: 20 },
];

// Define the validation
function validateAss(assessment) {
  const schema = {
    id: Joi.number().integer().min(1),
    title: Joi.string().required(),
    score: Joi.number().integer().min(0).max(20).required(),
  };
  return Joi.validate(assessment, schema);
}

// GET
app.get("/api/assessments", (req, res) => res.send(assessments));

app.get("/api/assessments/:id", (req, res) => {
  const assessment = assessments.find((c) => c.id === parseInt(req.params.id));

  if (!assessment) return res.status(404).send("Assessment not found");
  res.send(assessment);
});

app.post("/api/assessments", (req, res) => {
  const { error } = validateAss(req.body);
  //400 bad req
  if (error) return res.status(400).send(error.details[0].message);

  const assessment = {
    id: assessments.length + 1,
    title: req.body.title,
    score: req.body.score,
  };

  assessments.push(assessment);
  res.send(assessment);
});

// PUT
app.put("/api/assessments/:id", (req, res) => {
  const assessment = assessments.find((c) => c.id === parseInt(req.params.id));

  if (!assessment) return res.status(404).send("Assessment not found");
  const { error } = validateAss(req.body);
  // 400 bad requst
  if (error) return res.status(400).send(error.details[0].message);

  assessment.title = req.body.title;
  assessment.score = req.body.score;
  res.send(assessment);
});

// DELETE
app.delete("/api/assessments/:id", (req, res) => {
  const assessment = assessments.find((c) => c.id === parseInt(req.params.id));
  if (!assessment) res.status(404).send("Assessment not found");

  const index = assessments.indexOf(assessment);
  assessments.splice(index, 1);
  res.send(assessment);
});
